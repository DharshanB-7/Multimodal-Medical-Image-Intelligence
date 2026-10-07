import { MapPin, CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";
import { cn, pct } from "@/lib/utils";
import type { Finding } from "@/lib/types";

const sev = { info: "Informational", low: "Low", moderate: "Moderate", high: "High" } as const;
const sevStyle = { info: "bg-bg text-muted", low: "bg-bg text-muted", moderate: "bg-warn-bg text-warn", high: "bg-danger-bg text-danger" } as const;

export function FindingCard({ f, active, onSelect }: { f: Finding; active: boolean; onSelect: () => void }) {
  const loc = f.location;
  const visualText = f.evidence || f.visual_evidence || "Visual observation reported by AI.";
  const clinicalText = f.clinical_evidence || f.clinical_context;

  return (
    <article
      onClick={onSelect}
      className={cn(
        "cursor-pointer rounded-2xl border bg-surface p-5 transition",
        active ? "border-brand shadow-sm ring-1 ring-brand/30" : "border-line hover:border-muted"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold leading-tight">{f.label}</h3>
        <span className="text-lg font-semibold tabular-nums text-brand">{pct(f.confidence)}</span>
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs">
        {f.severity && (
          <span className={cn("rounded-full px-2.5 py-0.5 font-medium", sevStyle[f.severity])}>
            Priority: {sev[f.severity]}
          </span>
        )}
        <span className="inline-flex items-center gap-1 rounded-full bg-bg px-2.5 py-0.5 text-muted">
          <MapPin className="size-3" />
          {loc
            ? f.location_description ?? `x ${loc.x}, y ${loc.y}, ${loc.width}×${loc.height} px`
            : (f.localization_note ?? "Localization unavailable")}
        </span>
        {f.clinical_relation && f.clinical_relation !== "unknown" && f.clinical_relation !== "not_provided" && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
              f.clinical_relation === "supports" ? "bg-ok/10 text-ok" : "bg-bg text-muted"
            )}
          >
            {f.clinical_relation === "supports" ? (
              <CheckCircle2 className="size-3" />
            ) : f.clinical_relation === "contradicts" ? (
              <AlertCircle className="size-3" />
            ) : (
              <HelpCircle className="size-3" />
            )}
            Context: {f.clinical_relation}
          </span>
        )}
      </div>

      <dl className="mt-4 space-y-2.5 text-sm">
        <div>
          <dt className="text-xs font-medium text-muted uppercase tracking-wider">Visual Evidence</dt>
          <dd className="mt-0.5 text-ink/90">{visualText}</dd>
        </div>
        {clinicalText && (
          <div>
            <dt className="text-xs font-medium text-muted uppercase tracking-wider">Clinical Correlation</dt>
            <dd className="mt-0.5 text-ink/90">{clinicalText}</dd>
          </div>
        )}
        <div>
          <dt className="text-xs font-medium text-muted uppercase tracking-wider">Explanation</dt>
          <dd className="mt-0.5 text-muted">{f.explanation}</dd>
        </div>
      </dl>

      {loc ? (
        <p className="mt-3 font-mono text-[11px] text-muted">
          Region: x={loc.x} y={loc.y} w={loc.width} h={loc.height}
        </p>
      ) : (
        <p className="mt-3 text-xs italic text-muted">
          {f.localization_note ?? "Exact bounding box unconfirmed."}
        </p>
      )}
    </article>
  );
}
