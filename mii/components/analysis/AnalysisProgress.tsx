"use client";
import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Card } from "@/components/ui";

const steps = ["Uploading image", "Processing image", "Analyzing visual content", "Combining clinical context", "Generating evidence", "Preparing report"];

export function AnalysisProgress() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => Math.min(n + 1, steps.length - 1)), 2800);
    return () => clearInterval(t);
  }, []);
  return (
    <Card role="status" aria-live="polite">
      <h2 className="font-semibold">Analysis in progress</h2>
      <p className="text-sm text-muted">Running locally, this can take a minute. Stages are indicative; the backend does not report exact progress.</p>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-line"><div className="indeterminate h-full w-1/3 rounded-full bg-brand" /></div>
      <ol className="mt-5 space-y-2.5">
        {steps.map((s, n) => (
          <li key={s} className={`flex items-center gap-2.5 text-sm ${n > i ? "text-muted/60" : n === i ? "font-medium" : "text-muted"}`}>
            {n < i ? <Check className="size-4 text-ok" /> : n === i ? <Loader2 className="size-4 animate-spin text-brand" /> : <span className="size-4" />}{s}...
          </li>
        ))}
      </ol>
    </Card>
  );
}
