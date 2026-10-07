import type { AnalysisRequest, AnalysisResponse } from "./types";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
let counter = 1;

export async function mockAnalyze(req: AnalysisRequest, signal?: AbortSignal): Promise<AnalysisResponse> {
  await sleep(3500);
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
  const W = req.image_size?.width ?? 1024;
  const H = req.image_size?.height ?? 1024;
  const box = (fx: number, fy: number, fw: number, fh: number) => ({
    x: Math.round(W * fx), y: Math.round(H * fy), width: Math.round(W * fw), height: Math.round(H * fh),
  });
  const symptoms = req.symptoms?.trim();
  const used = [req.patient_age && "age", req.patient_sex && "sex", req.clinical_notes && "clinical notes",
    symptoms && "symptoms", req.test_results && "test results"].filter(Boolean) as string[];
  const id = `ANL-${String(counter++).padStart(4, "0")}`;
  return {
    analysis_id: id,
    model: { name: "medgemma1.5", version: "4B" },
    image: { width: W, height: H },
    assessment: { summary: "Possible abnormal region detected", overall_confidence: 0.87 },
    findings: [
      {
        id: "finding_1", label: "Possible opacity", confidence: 0.87, severity: "moderate",
        location: box(0.55, 0.5, 0.28, 0.25), location_description: "Lower-right region of the image",
        evidence: "A region of increased density was observed in the highlighted area.",
        clinical_context: symptoms ? `Reported symptoms: ${symptoms}` : "No symptoms were provided.",
        explanation: "The model identified a visually distinct region that differs from the surrounding tissue pattern. This may warrant clinical review alongside the patient history.",
      },
      {
        id: "finding_2", label: "Possible blunting of boundary", confidence: 0.64, severity: "low",
        location: box(0.15, 0.62, 0.2, 0.18), location_description: "Lower-left region of the image",
        evidence: "The boundary in this area appears less sharply defined.",
        explanation: "A softer edge was detected compared with the opposite side. Image positioning can also cause this, so it should be verified.",
      },
    ],
    clinical_context: {
      used: used.length > 0, fields_used: used,
      summary: used.length ? `The following inputs were considered: ${used.join(", ")}.` : "No clinical context was provided; the analysis used the image only.",
    },
    recommendation: "Doctor, consider reviewing the highlighted regions.",
    disclaimer: "This system is an AI-assisted clinical decision-support tool and is not a replacement for a qualified medical professional.",
  };
}
