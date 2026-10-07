export function ConfidenceRing({ value, size = 112 }: { value: number | null | undefined; size?: number }) {
  const r = 42, c = 2 * Math.PI * r;
  const hasVal = typeof value === "number" && !isNaN(value);
  const v = hasVal ? Math.max(0, Math.min(1, value!)) : 0;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={hasVal ? `Confidence ${Math.round(v * 100)} percent` : "Confidence uncalibrated"}>
      <svg viewBox="0 0 100 100" className="-rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--line)" strokeWidth="9" />
        {hasVal && (
          <circle cx="50" cy="50" r={r} fill="none" stroke="var(--brand)" strokeWidth="9" strokeLinecap="round" strokeDasharray={`${c * v} ${c}`} />
        )}
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="text-2xl font-semibold tabular-nums">{hasVal ? `${Math.round(v * 100)}%` : "N/A"}</div>
          <div className="text-[11px] text-muted">{hasVal ? "confidence" : "unrated"}</div>
        </div>
      </div>
    </div>
  );
}
