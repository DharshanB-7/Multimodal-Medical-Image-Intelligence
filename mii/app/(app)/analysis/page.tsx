"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FilePlus2, AlertTriangle, AlertCircle } from "lucide-react";
import { EvidenceViewer } from "@/components/evidence/EvidenceViewer";
import { ConfidenceRing } from "@/components/charts/ConfidenceRing";
import { FindingCard } from "@/components/results/FindingCard";
import { Disclaimer } from "@/components/layout/Disclaimer";
import { ButtonLink, Card, CardTitle } from "@/components/ui";
import { loadCurrent } from "@/lib/store";
import { formatDate, formatTime, pct } from "@/lib/utils";
import type { StoredAnalysis } from "@/lib/types";

function Results() {
  const [a, setA] = useState<StoredAnalysis | null | undefined>(undefined);
  const [active, setActive] = useState<string | null>(null);
  const threshold = Number(useSearchParams().get("threshold") ?? 0) || 0;
  useEffect(() => setA(loadCurrent()), []);

  if (a === undefined) return <p className="text-muted">Loading results...</p>;
  if (a === null) return (
    <Card className="text-center">
      <p className="font-medium">No analysis to show</p>
      <p className="mb-4 text-sm text-muted">Run an analysis to see results here.</p>
      <ButtonLink href="/dashboard">New Analysis</ButtonLink>
    </Card>
  );
  const { response: r, request: q } = a;
  const findings = r.findings.filter((f) => (f.confidence ?? 0) >= threshold);
  const hidden = r.findings.length - findings.length;
  const fields = r.clinical_context.fields_used ?? [];
  const rows: [string, string | undefined][] = [
    ["Patient", [q.patient_id, q.patient_age ? `${q.patient_age} y` : "", q.patient_sex].filter(Boolean).join(" · ") || undefined],
    ["Symptoms", q.symptoms],
    ["Clinical notes", q.clinical_notes],
    ["Test results", q.test_results],
  ];
  const first = findings[0];
  const isInsufficient = r.assessment.status === "insufficient_evidence";

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Analysis {r.analysis_id}</h1>
          <p className="text-sm text-muted">
            {formatDate(a.created_at)}, {formatTime(a.created_at)} · {r.model.name} {r.model.version} · {q.image_name}
          </p>
        </div>
        <ButtonLink href="/dashboard" variant="outline">
          <FilePlus2 className="size-4" />Start another analysis
        </ButtonLink>
      </header>
      <Disclaimer />

      {r.warnings && r.warnings.length > 0 && (
        <div className="rounded-xl border border-warn/30 bg-warn-bg/40 p-4 text-sm text-warn">
          <div className="flex items-center gap-2 font-medium">
            <AlertTriangle className="size-4 shrink-0" />
            <span>Model Observations & Warnings</span>
          </div>
          <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
            {r.warnings.map((w, idx) => (
              <li key={idx}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {isInsufficient && (
        <div className="rounded-xl border border-line bg-surface p-4 text-sm">
          <div className="flex items-center gap-2 font-medium text-ink">
            <AlertCircle className="size-4 text-muted" />
            <span>Insufficient Evidence for a Definite Finding</span>
          </div>
          <p className="mt-1 text-xs text-muted">
            The AI vision model evaluated the image and context but did not identify sufficient visual or supporting clinical evidence for a localized finding. Clinical review of the primary image is recommended.
          </p>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_1.3fr_1fr]">
        <Card className="self-start">
          <CardTitle>Original image</CardTitle>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={a.image_data_url} alt="Original medical image" className="max-h-[70vh] w-full rounded-xl bg-black object-contain" />
        </Card>
        <Card className="self-start">
          <CardTitle hint="Select a box to focus a finding.">AI evidence</CardTitle>
          <EvidenceViewer src={a.image_data_url} size={a.image_size} findings={findings} activeId={active ?? first?.id} onSelect={setActive} />
        </Card>
        <Card className="self-start">
          <CardTitle>AI assessment</CardTitle>
          <div className="flex items-center gap-4">
            <ConfidenceRing value={r.assessment.overall_confidence} />
            <div>
              <p className="text-sm text-muted">AI-assisted observation</p>
              <p className="font-medium">{r.assessment.summary}</p>
            </div>
          </div>
          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="font-medium">Evidence</dt>
              <dd className="text-muted">
                {first ? `${first.location_description ?? "See highlighted region"}. ${first.evidence}` : "No visual evidence returned."}
              </dd>
            </div>
            <div>
              <dt className="font-medium">Clinical context</dt>
              <dd className="text-muted">{r.clinical_context.summary}</dd>
            </div>
            <div>
              <dt className="font-medium">Recommendation</dt>
              <dd className="text-muted">{r.recommendation}</dd>
            </div>
          </dl>
        </Card>
      </div>

      <section aria-labelledby="f">
        <h2 id="f" className="mb-3 text-lg font-semibold">Findings ({findings.length})</h2>
        {findings.length === 0 ? (
          <Card>
            <p className="font-medium">No findings returned</p>
            <p className="text-sm text-muted">
              The model did not report a region for review{hidden ? `; ${hidden} below the ${pct(threshold)} threshold are hidden` : ""}. This does not rule out a condition.
            </p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {findings.map((f) => (
              <FindingCard key={f.id} f={f} active={(active ?? first?.id) === f.id} onSelect={() => setActive(f.id)} />
            ))}
          </div>
        )}
        {hidden > 0 && findings.length > 0 && (
          <p className="mt-2 text-xs text-muted">
            {hidden} finding(s) hidden by the {pct(threshold)} confidence threshold.
          </p>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardTitle hint={r.clinical_context.used ? "Inputs the backend reports it considered are marked." : "The backend reports that no clinical context was used."}>
            Clinical context
          </CardTitle>
          <dl className="space-y-3 text-sm">
            {rows.map(([k, v]) => {
              const used = fields.some((x) => k.toLowerCase().includes(x.split(" ")[0].toLowerCase()) || (k === "Patient" && /age|sex/.test(x)));
              return (
                <div key={k} className="flex justify-between gap-4 border-b border-line pb-2 last:border-0">
                  <dt className="font-medium">{k}</dt>
                  <dd className="text-right text-muted">
                    {v || "Not provided"}
                    {v && fields.length > 0 && <span className={`ml-2 text-xs ${used ? "text-ok" : ""}`}>{used ? "used" : ""}</span>}
                  </dd>
                </div>
              );
            })}
          </dl>
        </Card>
        <Card>
          <CardTitle>Why did the AI identify this finding?</CardTitle>
          {first ? (
            <div className="space-y-4 text-sm">
              <p>{first.explanation}</p>
              <div>
                <p className="font-medium">Visual evidence</p>
                <p className="text-muted">{first.evidence}</p>
              </div>
              <div>
                <p className="font-medium">Clinical evidence</p>
                <p className="text-muted">{first.clinical_context ?? r.clinical_context.summary}</p>
              </div>
              <div>
                <p className="font-medium">Confidence</p>
                <p className="text-muted">{pct(first.confidence)} for this finding. Treat as an AI-assisted observation, not a diagnosis.</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted">No finding to explain.</p>
          )}
        </Card>
      </div>
      <p className="text-xs text-muted">{r.disclaimer}</p>
    </div>
  );
}
export default function AnalysisPage() { return <Suspense><Results /></Suspense>; }
export const dynamic = "force-dynamic";
