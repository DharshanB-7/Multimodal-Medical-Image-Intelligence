import { mockAnalyze } from "./mock-api";
import type { AnalysisRequest, AnalysisResponse } from "./types";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";
const TIMEOUT_MS = 180_000; // multimodal inference can take time on CPU/GPU

export type ApiErrorCode =
  | "network"
  | "unavailable"
  | "timeout"
  | "invalid_response"
  | "unsupported_image"
  | "too_large"
  | "bad_request";

export class ApiError extends Error {
  constructor(public code: ApiErrorCode, message: string, public backendDetail?: string) {
    super(message);
  }
}

export const ERROR_COPY: Record<ApiErrorCode, { title: string; hint: string }> = {
  network: {
    title: "Unable to connect to the AI analysis service.",
    hint: `Check that the backend is running at ${API_URL} and NEXT_PUBLIC_API_URL is correct.`,
  },
  unavailable: {
    title: "The AI analysis service is unavailable.",
    hint: "The backend or Ollama vision model returned an error. Ensure Ollama is running.",
  },
  timeout: {
    title: "The analysis took too long and timed out.",
    hint: "Local vision models take longer on high-resolution images. Try resizing or retrying.",
  },
  invalid_response: {
    title: "The service returned an unexpected response.",
    hint: "The response did not match the API contract.",
  },
  unsupported_image: {
    title: "This image format is not supported.",
    hint: "Use a PNG, JPG, JPEG, or WEBP image.",
  },
  too_large: {
    title: "The image is too large.",
    hint: "Use an image under 10 MB.",
  },
  bad_request: {
    title: "The service rejected the request.",
    hint: "Check the clinical details and try again.",
  },
};

export interface ModelStatus {
  model: string;
  available: boolean;
  mock: boolean;
}

export async function getModelStatus(): Promise<ModelStatus | null> {
  if (USE_MOCK) {
    return { model: "medgemma1.5:4b (mock-frontend)", available: true, mock: true };
  }
  try {
    const res = await fetch(`${API_URL}/api/v1/model/status`, {
      method: "GET",
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function isResponse(d: unknown): d is AnalysisResponse {
  const r = d as AnalysisResponse;
  return (
    !!r &&
    typeof r === "object" &&
    typeof r.analysis_id === "string" &&
    Array.isArray(r.findings) &&
    !!r.assessment &&
    (typeof r.assessment.overall_confidence === "number" || r.assessment.overall_confidence === null) &&
    r.findings.every(
      (f) =>
        f &&
        typeof f.id === "string" &&
        typeof f.label === "string" &&
        (typeof f.confidence === "number" || f.confidence === null) &&
        (f.location === null ||
          f.location === undefined ||
          (typeof f.location === "object" &&
            typeof f.location.x === "number" &&
            typeof f.location.y === "number"))
    )
  );
}

export async function analyzeImage(req: AnalysisRequest): Promise<AnalysisResponse> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    if (USE_MOCK) return await mockAnalyze(req, ctrl.signal);

    const fd = new FormData();
    fd.append("image", req.image);
    if (req.patient_age !== undefined && req.patient_age !== null && !isNaN(req.patient_age)) {
      fd.append("patient_age", String(req.patient_age));
    }
    if (req.patient_sex) fd.append("patient_sex", req.patient_sex);
    if (req.clinical_notes) fd.append("clinical_notes", req.clinical_notes);
    if (req.symptoms) fd.append("symptoms", req.symptoms);
    if (req.test_results) fd.append("test_results", req.test_results);

    let res: Response;
    try {
      res = await fetch(`${API_URL}/api/v1/analyze`, {
        method: "POST",
        body: fd,
        signal: ctrl.signal,
      });
    } catch (e) {
      if ((e as Error).name === "AbortError") throw new ApiError("timeout", "Timed out waiting for AI model");
      throw new ApiError("network", "Failed to connect to backend server");
    }

    if (!res.ok) {
      let backendDetail: string | undefined;
      try {
        const errorJson = await res.json();
        backendDetail = errorJson?.error?.message;
      } catch {
        // non-json response
      }

      if (res.status === 413) throw new ApiError("too_large", backendDetail ?? "Image too large", backendDetail);
      if (res.status === 415) throw new ApiError("unsupported_image", backendDetail ?? "Unsupported image format", backendDetail);
      if (res.status >= 500) throw new ApiError("unavailable", backendDetail ?? `Backend error (${res.status})`, backendDetail);
      throw new ApiError("bad_request", backendDetail ?? `Request rejected (${res.status})`, backendDetail);
    }

    let data: unknown;
    try {
      data = await res.json();
    } catch {
      throw new ApiError("invalid_response", "Invalid JSON from backend");
    }

    if (!isResponse(data)) {
      throw new ApiError("invalid_response", "Backend response did not match expected contract");
    }

    // Normalize additive fields from backend to frontend expectations
    for (const f of data.findings) {
      if (!f.evidence) {
        f.evidence = f.visual_evidence || "Visual finding reported by AI vision model.";
      }
      if (!f.clinical_context && f.clinical_evidence) {
        f.clinical_context = f.clinical_evidence;
      }
    }

    return data;
  } catch (e) {
    if (e instanceof ApiError) throw e;
    if ((e as Error).name === "AbortError") throw new ApiError("timeout", "Analysis request timed out");
    throw new ApiError("network", (e as Error).message);
  } finally {
    clearTimeout(timer);
  }
}
