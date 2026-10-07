"use client";
import { useEffect, useState } from "react";
import { ImageIcon } from "lucide-react";
import { ButtonLink, Card } from "@/components/ui";
import { getHistory } from "@/lib/store";
import { formatDate, formatTime, pct } from "@/lib/utils";
import type { AnalysisHistory } from "@/lib/types";

export default function HistoryPage() {
  const [rows, setRows] = useState<AnalysisHistory[]>([]);
  useEffect(() => setRows(getHistory()), []);
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div><h1 className="text-2xl font-semibold tracking-tight">Analysis history</h1>
          <p className="mt-1 text-muted">Stored in this browser only. Sample entries are shown until you run an analysis.</p></div>
        <ButtonLink href="/dashboard">New Analysis</ButtonLink>
      </header>
      <div className="grid gap-3">
        {rows.map((h) => (
          <Card key={h.analysis_id} className="flex flex-wrap items-center gap-4 !p-4">
            <div className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-lg bg-bg text-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {h.thumbnail ? <img src={h.thumbnail} alt="" className="size-full object-cover" /> : <ImageIcon className="size-5" />}
            </div>
            <div className="min-w-32 flex-1"><p className="font-semibold">{h.analysis_id}</p><p className="text-sm text-muted">{formatDate(h.created_at)}, {formatTime(h.created_at)}</p></div>
            <p className="text-sm">{h.finding_count} finding{h.finding_count === 1 ? "" : "s"}</p>
            <p className="text-sm text-muted">{h.finding_count ? `${pct(h.highest_confidence)} highest confidence` : "No confidence"}</p>
            <span className="rounded-full bg-bg px-2.5 py-1 text-xs font-medium">{h.status === "completed" ? "Completed" : "No findings"}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}
