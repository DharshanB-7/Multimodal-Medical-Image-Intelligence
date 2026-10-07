export interface BoundingBox { x: number; y: number; width: number; height: number }
export type Severity = "info" | "low" | "moderate" | "high";
export type ClinicalRelation = "supports" | "contradicts" | "unrelated" | "unknown" | "not_provided";

export interface Finding {
  id: string;
  label: string;
  confidence: number | null; // 0..1 or null when unestimated
  location: BoundingBox | null; // pixels on ORIGINAL uploaded image or null if unlocalized
  localization_note?: string | null;
  evidence: string;
  visual_evidence?: string | null;
  clinical_evidence?: string | null;
  clinical_relation?: ClinicalRelation;
  clinical_context?: string;
  explanation: string;
  // Optional extensions
  severity?: Severity;
  location_description?: string;
  heatmap_url?: string;
}

export interface Assessment {
  summary: string;
  overall_confidence: number | null;
  status?: "findings_reported" | "insufficient_evidence";
}

export interface ClinicalContext {
  used: boolean;
  summary: string;
  fields_used?: string[];
}

export interface AnalysisRequest {
  image: File;
  patient_age?: number;
  patient_sex?: string;
  clinical_notes?: string;
  symptoms?: string;
  test_results?: string;
  /** Client-only hint used by the mock API; never sent to the backend. */
  image_size?: { width: number; height: number };
}

export interface AnalysisResponse {
  analysis_id: string;
  model: { name: string; version: string };
  assessment: Assessment;
  findings: Finding[];
  clinical_context: ClinicalContext;
  recommendation: string;
  disclaimer: string;
  warnings?: string[];
  /** Optional: original image dimensions in pixels. Falls back to the browser-measured size. */
  image?: { filename?: string; width: number; height: number; format?: string };
}

export interface AnalysisHistory {
  analysis_id: string;
  created_at: string; // ISO
  thumbnail?: string;
  finding_count: number;
  highest_confidence: number | null;
  status: "completed" | "no_findings";
}

export interface StoredAnalysis {
  response: AnalysisResponse;
  request: Omit<AnalysisRequest, "image" | "image_size"> & { image_name: string; patient_id?: string };
  image_data_url: string;
  image_size: { width: number; height: number };
  created_at: string;
}
