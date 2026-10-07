import type { AnalysisHistory, StoredAnalysis } from "./types";
const CUR = "mii.current";
const HIST = "mii.history";

export function saveCurrent(a: StoredAnalysis) {
  try { sessionStorage.setItem(CUR, JSON.stringify(a)); } catch { /* storage full: ignore */ }
}
export function loadCurrent(): StoredAnalysis | null {
  try { const v = sessionStorage.getItem(CUR); return v ? (JSON.parse(v) as StoredAnalysis) : null; } catch { return null; }
}
const seed: AnalysisHistory[] = [
  { analysis_id: "ANL-0003", created_at: "2026-10-07T09:42:00Z", finding_count: 3, highest_confidence: 0.87, status: "completed" },
  { analysis_id: "ANL-0002", created_at: "2026-10-06T15:10:00Z", finding_count: 1, highest_confidence: 0.71, status: "completed" },
  { analysis_id: "ANL-0001", created_at: "2026-10-05T11:03:00Z", finding_count: 0, highest_confidence: 0, status: "no_findings" },
];
export function getHistory(): AnalysisHistory[] {
  try {
    const v = localStorage.getItem(HIST);
    if (v) return JSON.parse(v) as AnalysisHistory[];
  } catch { /* fall through */ }
  return seed;
}
export function addHistory(h: AnalysisHistory) {
  try { localStorage.setItem(HIST, JSON.stringify([h, ...getHistory().filter((x) => x.analysis_id !== h.analysis_id)].slice(0, 25))); } catch { /* ignore */ }
}
