"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ScanSearch } from "lucide-react";
import { ImageUpload } from "@/components/upload/ImageUpload";
import { PatientForm, emptyPatient, type PatientData } from "@/components/patient/PatientForm";
import { SettingsCard } from "@/components/analysis/SettingsCard";
import { AnalysisProgress } from "@/components/analysis/AnalysisProgress";
import { ErrorPanel } from "@/components/results/ErrorPanel";
import { Disclaimer } from "@/components/layout/Disclaimer";
import { Button, Card, CardTitle } from "@/components/ui";
import { ApiError, ERROR_COPY, analyzeImage, type ApiErrorCode } from "@/lib/api";
import { addHistory, saveCurrent } from "@/lib/store";
import { toDataUrl } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dims, setDims] = useState<{ width: number; height: number } | null>(null);
  const [patient, setPatient] = useState<PatientData>(emptyPatient);
  const [threshold, setThreshold] = useState(0);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<{ title: string; hint?: string } | null>(null);
  const url = useRef<string | null>(null);

  useEffect(() => () => { if (url.current) URL.revokeObjectURL(url.current); }, []);

  const select = (f: File) => {
    if (url.current) URL.revokeObjectURL(url.current);
    const u = URL.createObjectURL(f);
    url.current = u; setFile(f); setPreview(u); setError(null); setDims(null);
    const img = new Image();
    img.onload = () => setDims({ width: img.naturalWidth, height: img.naturalHeight });
    img.src = u;
  };
  const remove = () => { if (url.current) URL.revokeObjectURL(url.current); url.current = null; setFile(null); setPreview(null); setDims(null); };

  const run = async () => {
    if (!file) return;
    setRunning(true); setError(null);
    try {
      const age = patient.patient_age ? Number(patient.patient_age) : undefined;
      const res = await analyzeImage({
        image: file, patient_age: age, patient_sex: patient.patient_sex, clinical_notes: patient.clinical_notes,
        symptoms: patient.symptoms, test_results: patient.test_results, image_size: dims ?? undefined,
      });
      const { url: dataUrl, width, height } = await toDataUrl(file, 1600);
      const thumb = await toDataUrl(file, 96);
      const created_at = new Date().toISOString();
      saveCurrent({
        response: res, image_data_url: dataUrl, image_size: res.image ?? { width, height }, created_at,
        request: { image_name: file.name, patient_id: patient.patient_id, patient_age: age, patient_sex: patient.patient_sex,
          clinical_notes: patient.clinical_notes, symptoms: patient.symptoms, test_results: patient.test_results },
      });
      const top = res.findings.length
        ? Math.max(0, ...res.findings.map((f) => f.confidence ?? 0))
        : 0;
      addHistory({ analysis_id: res.analysis_id, created_at, thumbnail: thumb.url, finding_count: res.findings.length,
        highest_confidence: top, status: res.findings.length ? "completed" : "no_findings" });
      router.push(`/analysis?threshold=${threshold}`);
    } catch (e) {
      const code: ApiErrorCode = e instanceof ApiError ? e.code : "network";
      const baseCopy = ERROR_COPY[code];
      const customHint = e instanceof ApiError && e.backendDetail ? `${baseCopy.hint} (Detail: ${e.backendDetail})` : baseCopy.hint;
      setError({ title: baseCopy.title, hint: customHint }); setRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Medical Image Analysis</h1>
        <p className="mt-1 text-muted">Upload an image and provide clinical context for AI-assisted analysis.</p>
      </header>
      <Disclaimer />
      {error && <ErrorPanel {...error} onRetry={file ? run : undefined} />}
      {running ? <AnalysisProgress /> : (
        <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
          <Card id="upload" className="self-start scroll-mt-6">
            <CardTitle hint="The image is only sent when you select Analyze Image.">Medical image</CardTitle>
            <ImageUpload file={file} previewUrl={preview} dims={dims} onSelect={select} onRemove={remove} onError={(m) => setError({ title: m })} />
          </Card>
          <div className="space-y-6">
            <PatientForm value={patient} onChange={setPatient} />
            <SettingsCard threshold={threshold} onThreshold={setThreshold} />
            <Button className="w-full py-3" disabled={!file} onClick={run}><ScanSearch className="size-4" />Analyze Image</Button>
          </div>
        </div>
      )}
    </div>
  );
}
