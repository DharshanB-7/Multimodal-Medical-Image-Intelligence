"use client";
import { Card, CardTitle, Field, inputClass } from "@/components/ui";

export function SettingsCard({ threshold, onThreshold, disabled }: { threshold: number; onThreshold: (n: number) => void; disabled?: boolean }) {
  return (
    <Card>
      <CardTitle>Analysis settings</CardTitle>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Model"><input className={inputClass} value="MedGemma 1.5 4B" readOnly disabled /></Field>
        <Field label="Mode"><input className={inputClass} value="Clinical Image Analysis" readOnly disabled /></Field>
      </div>
      <label className="mt-4 block">
        <span className="mb-1.5 flex justify-between text-sm font-medium">Confidence threshold <span className="tabular-nums text-muted">{Math.round(threshold * 100)}%</span></span>
        <input type="range" min={0} max={0.95} step={0.05} value={threshold} disabled={disabled} onChange={(e) => onThreshold(Number(e.target.value))} className="w-full accent-[var(--brand)]" />
        <span className="text-xs text-muted">Hides findings below this confidence in the results view.</span>
      </label>
    </Card>
  );
}
