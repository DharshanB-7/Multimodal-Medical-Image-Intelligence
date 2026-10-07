"use client";
import { useEffect, useState } from "react";
import { getModelStatus, type ModelStatus } from "@/lib/api";

export function ModelStatusBadge() {
  const [status, setStatus] = useState<ModelStatus | null | undefined>(undefined);

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      const s = await getModelStatus();
      if (mounted) setStatus(s);
    };
    check();
    const interval = setInterval(check, 15000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  if (status === undefined) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-line bg-bg/50 px-3 py-1.5 text-xs text-muted">
        <span className="size-2 animate-pulse rounded-full bg-muted" />
        <span>Connecting to AI...</span>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-danger/30 bg-danger-bg/40 px-3 py-1.5 text-xs text-danger">
        <span className="size-2 rounded-full bg-danger" />
        <span>AI Backend: Offline</span>
      </div>
    );
  }

  if (status.mock) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-line bg-bg px-3 py-1.5 text-xs text-muted">
        <span className="size-2 rounded-full bg-brand" />
        <span className="truncate">AI: Mock Mode</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border border-ok/30 bg-ok/10 px-3 py-1.5 text-xs text-ok">
      <span className="size-2 animate-pulse rounded-full bg-ok" />
      <span className="truncate font-medium">Online ({status.model})</span>
    </div>
  );
}
