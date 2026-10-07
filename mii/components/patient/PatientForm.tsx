"use client";
import { Card, CardTitle, Field, inputClass } from "@/components/ui";

export interface PatientData {
  patient_id: string; patient_age: string; patient_sex: string; clinical_notes: string; symptoms: string; test_results: string;
}
export const emptyPatient: PatientData = { patient_id: "", patient_age: "", patient_sex: "", clinical_notes: "", symptoms: "", test_results: "" };

export function PatientForm({ value, onChange, disabled }: { value: PatientData; onChange: (v: PatientData) => void; disabled?: boolean }) {
  const set = (k: keyof PatientData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    onChange({ ...value, [k]: e.target.value });
  const ph = "Enter relevant clinical information...";
  return (
    <Card>
      <CardTitle hint="Patient ID stays in your browser and is never sent to the backend.">Patient information</CardTitle>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Patient ID" optional><input className={inputClass} value={value.patient_id} onChange={set("patient_id")} placeholder="e.g. P-1042" disabled={disabled} /></Field>
        <Field label="Age"><input className={inputClass} type="number" min={0} max={120} value={value.patient_age} onChange={set("patient_age")} placeholder="Years" disabled={disabled} /></Field>
        <Field label="Sex">
          <select className={inputClass} value={value.patient_sex} onChange={set("patient_sex")} disabled={disabled}>
            <option value="">Select</option><option value="female">Female</option><option value="male">Male</option>
            <option value="other">Other</option><option value="unspecified">Prefer not to say</option>
          </select>
        </Field>
      </div>
      <div className="mt-4 grid gap-4">
        <Field label="Symptoms"><textarea rows={2} className={inputClass} value={value.symptoms} onChange={set("symptoms")} placeholder={ph} disabled={disabled} /></Field>
        <Field label="Clinical notes"><textarea rows={3} className={inputClass} value={value.clinical_notes} onChange={set("clinical_notes")} placeholder={ph} disabled={disabled} /></Field>
        <Field label="Relevant test results"><textarea rows={2} className={inputClass} value={value.test_results} onChange={set("test_results")} placeholder={ph} disabled={disabled} /></Field>
      </div>
    </Card>
  );
}
