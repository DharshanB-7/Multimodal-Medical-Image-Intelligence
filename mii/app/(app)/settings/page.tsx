"use client";
import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, RefreshCw, Cpu, Globe, Server } from "lucide-react";
import { Button, Card, CardTitle } from "@/components/ui";
import { API_URL, USE_MOCK, getModelStatus, type ModelStatus } from "@/lib/api";

export default function SettingsPage() {
  const [status, setStatus] = useState<ModelStatus | null | undefined>(undefined);
  const [checking, setChecking] = useState(false);

  const checkConnection = async () => {
    setChecking(true);
    const s = await getModelStatus();
    setStatus(s);
    setChecking(false);
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const rows = [
    ["Data Source", USE_MOCK ? "Mock API (NEXT_PUBLIC_USE_MOCK_API=true)" : "Live Backend (FastAPI + Ollama)"],
    ["Backend Base URL", API_URL],
    ["Vision Model", status?.model ?? "MedGemma 1.5 4B"],
    ["Backend Mode", status?.mock ? "Mock Mode" : "Real Inference via Ollama"],
  ];

  return (
    <div className="max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">System & Backend Settings</h1>
        <p className="mt-1 text-muted">Verify backend connectivity and AI multimodal model status.</p>
      </header>

      <Card>
        <div className="flex items-center justify-between">
          <CardTitle>AI Service Status</CardTitle>
          <Button variant="outline" className="px-3 py-1.5 text-xs" onClick={checkConnection} disabled={checking}>
            <RefreshCw className={`size-3.5 mr-1 ${checking ? "animate-spin" : ""}`} />
            Check Connection
          </Button>
        </div>

        <div className="mt-4 rounded-xl border border-line bg-bg p-4">
          <div className="flex items-center gap-3">
            {status === undefined ? (
              <span className="size-3 animate-pulse rounded-full bg-muted" />
            ) : status && status.available ? (
              <CheckCircle2 className="size-5 text-ok" />
            ) : (
              <XCircle className="size-5 text-danger" />
            )}
            <div>
              <p className="text-sm font-semibold">
                {status === undefined
                  ? "Testing connection..."
                  : status && status.available
                  ? `AI Model Connected (${status.model})`
                  : "AI Model Unavailable or Offline"}
              </p>
              <p className="text-xs text-muted">
                {status === undefined
                  ? "Pinging API status endpoint..."
                  : status && status.available
                  ? `Successfully reachable at ${API_URL}/api/v1/model/status`
                  : `Could not reach ${API_URL}. Ensure the FastAPI server is running.`}
              </p>
            </div>
          </div>
        </div>

        <dl className="mt-5 space-y-3 text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 border-b border-line pb-2 last:border-0">
              <dt className="font-medium text-ink">{k}</dt>
              <dd className="break-all text-right text-muted">{v}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <Card>
        <CardTitle>Architecture Overview</CardTitle>
        <div className="mt-3 space-y-3 text-sm text-muted">
          <div className="flex items-start gap-2.5">
            <Globe className="size-4 shrink-0 mt-0.5 text-brand" />
            <p><strong className="text-ink">Next.js Frontend:</strong> Renders clinical decision-support interface, image overlays, and evidence grounding.</p>
          </div>
          <div className="flex items-start gap-2.5">
            <Server className="size-4 shrink-0 mt-0.5 text-brand" />
            <p><strong className="text-ink">FastAPI Backend:</strong> Validates images, enforces anti-fabrication rules, and grounds clinical findings.</p>
          </div>
          <div className="flex items-start gap-2.5">
            <Cpu className="size-4 shrink-0 mt-0.5 text-brand" />
            <p><strong className="text-ink">Ollama (MedGemma 1.5:4b):</strong> Multimodal vision-language model performing local image analysis.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
