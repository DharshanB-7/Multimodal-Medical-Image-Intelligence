import { AlertTriangle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui";

export function ErrorPanel({ title, hint, onRetry }: { title: string; hint?: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-wrap items-center gap-4 rounded-2xl border border-danger/30 bg-danger-bg p-5 text-danger">
      <AlertTriangle className="size-5 shrink-0" />
      <div className="min-w-0 flex-1"><p className="font-medium">{title}</p>{hint && <p className="text-sm opacity-90">{hint}</p>}</div>
      {onRetry && <Button variant="outline" onClick={onRetry}><RotateCw className="size-4" />Retry Analysis</Button>}
    </div>
  );
}
