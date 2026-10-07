import { Disclaimer } from "@/components/layout/Disclaimer";
import { Card, CardTitle } from "@/components/ui";

export default function AboutPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <header><h1 className="text-2xl font-semibold tracking-tight">About</h1>
        <p className="mt-1 text-muted">Multimodal Medical Image Intelligence is a clinical decision-support and second-opinion tool.</p></header>
      <Card><CardTitle>How it works</CardTitle>
        <p className="text-sm text-muted">You upload an image and add clinical context. The frontend sends both to a separate backend running MedGemma 1.5 4B locally. The backend returns possible findings, regions to review, confidence scores and explanations, which are shown here for a clinician to assess.</p></Card>
      <Card><CardTitle>API contract</CardTitle>
        <p className="font-mono text-sm">POST /api/v1/analyze (multipart/form-data)</p>
        <p className="mt-2 text-sm text-muted">Fields: image, patient_age, patient_sex, clinical_notes, symptoms, test_results. Box coordinates are pixels on the original image.</p></Card>
      <Disclaimer />
    </div>
  );
}
