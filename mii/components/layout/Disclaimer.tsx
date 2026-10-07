import { ShieldAlert } from "lucide-react";
export const DISCLAIMER =
  "This system is an AI-assisted clinical decision-support tool and is not a replacement for a qualified medical professional. Findings should be reviewed by an appropriately qualified clinician.";
export function Disclaimer({ className = "" }: { className?: string }) {
  return (
    <div role="note" className={`flex items-start gap-3 rounded-xl border border-warn/30 bg-warn-bg px-4 py-3 text-sm text-warn ${className}`}>
      <ShieldAlert className="mt-0.5 size-4 shrink-0" /><p>{DISCLAIMER}</p>
    </div>
  );
}
