"use client";
import { useRef, useState } from "react";
import { Layers, Maximize2, RotateCcw, ScanSearch, SquareDashed, ZoomIn, ZoomOut, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui";
import { cn, pct } from "@/lib/utils";
import type { Finding } from "@/lib/types";

interface Props {
  src: string;
  size?: { width: number; height: number };
  findings: Finding[];
  activeId?: string | null;
  onSelect?: (id: string) => void;
}

export function EvidenceViewer({ src, size, findings, activeId, onSelect }: Props) {
  const [dims, setDims] = useState(size);
  const [evidence, setEvidence] = useState(true);
  const [boxes, setBoxes] = useState(true);
  const [heat, setHeat] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [off, setOff] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const frame = useRef<HTMLDivElement>(null);
  const ratio = dims ? dims.width / dims.height : 1;
  const W = dims?.width ?? 1, H = dims?.height ?? 1;
  const clampPct = (v: number) => Math.max(0, Math.min(100, v));

  const localizedFindings = findings.filter((f) => f.location !== null && f.location !== undefined);
  const unlocalizedCount = findings.length - localizedFindings.length;

  const setZ = (z: number) => {
    const n = Math.max(1, Math.min(5, z));
    setZoom(n);
    if (n === 1) setOff({ x: 0, y: 0 });
  };
  const T = ({ on, set, icon: I, label }: { on: boolean; set: () => void; icon: typeof Layers; label: string }) => (
    <Button variant={on ? "primary" : "outline"} className="px-3 py-1.5" aria-pressed={on} onClick={set}>
      <I className="size-4" />{label}
    </Button>
  );

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-lg border border-line p-0.5" role="group" aria-label="View mode">
          {([false, true] as const).map((v) => (
            <button
              key={String(v)}
              onClick={() => setEvidence(v)}
              aria-pressed={evidence === v}
              className={cn("rounded-md px-3 py-1.5 text-sm", evidence === v ? "bg-brand text-brand-ink" : "text-muted hover:text-ink")}
            >
              {v ? "AI Evidence" : "Original"}
            </button>
          ))}
        </div>
        {evidence && localizedFindings.length > 0 && (
          <>
            <T on={boxes} set={() => setBoxes(!boxes)} icon={SquareDashed} label="Boxes" />
            <T on={heat} set={() => setHeat(!heat)} icon={Layers} label="Heatmap" />
          </>
        )}
        <div className="ml-auto flex gap-1">
          <Button variant="outline" className="px-2.5 py-1.5" aria-label="Zoom out" onClick={() => setZ(zoom - 0.5)}>
            <ZoomOut className="size-4" />
          </Button>
          <Button variant="outline" className="px-2.5 py-1.5" aria-label="Zoom in" onClick={() => setZ(zoom + 0.5)}>
            <ZoomIn className="size-4" />
          </Button>
          <Button variant="outline" className="px-2.5 py-1.5" aria-label="Reset view" onClick={() => setZ(1)}>
            <RotateCcw className="size-4" />
          </Button>
          <Button variant="outline" className="px-2.5 py-1.5" aria-label="Fullscreen" onClick={() => frame.current?.requestFullscreen?.()}>
            <Maximize2 className="size-4" />
          </Button>
        </div>
      </div>

      <div ref={frame} className="relative grid place-items-center rounded-xl bg-black">
        <div
          className={cn("relative touch-none select-none overflow-hidden", zoom > 1 ? "cursor-grab active:cursor-grabbing" : "")}
          style={{ aspectRatio: String(ratio), width: `min(100%, ${75 * ratio}vh)` }}
          onPointerDown={(e) => {
            if (zoom > 1) {
              e.currentTarget.setPointerCapture(e.pointerId);
              drag.current = { x: e.clientX, y: e.clientY, ox: off.x, oy: off.y };
            }
          }}
          onPointerMove={(e) => {
            const d = drag.current;
            if (d) setOff({ x: d.ox + e.clientX - d.x, y: d.oy + e.clientY - d.y });
          }}
          onPointerUp={() => {
            drag.current = null;
          }}
        >
          <div className="absolute inset-0" style={{ transform: `translate(${off.x}px, ${off.y}px) scale(${zoom})` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={evidence ? "Medical image with AI evidence overlay" : "Original medical image"}
              draggable={false}
              className="h-full w-full object-contain"
              onLoad={(e) => !dims && setDims({ width: e.currentTarget.naturalWidth, height: e.currentTarget.naturalHeight })}
            />
            {evidence && dims && localizedFindings.map((f) => {
              if (!f.location) return null;
              const l = clampPct((f.location.x / W) * 100), t = clampPct((f.location.y / H) * 100);
              const w = clampPct((f.location.width / W) * 100), h = clampPct((f.location.height / H) * 100);
              const active = f.id === activeId;
              return (
                <div key={f.id}>
                  {heat && (f.heatmap_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={f.heatmap_url} alt="" className="pointer-events-none absolute inset-0 h-full w-full opacity-60 mix-blend-screen" />
                  ) : (
                    <div
                      className="pointer-events-none absolute"
                      style={{
                        left: `${l}%`,
                        top: `${t}%`,
                        width: `${w}%`,
                        height: `${h}%`,
                        background: "radial-gradient(closest-side, rgba(255,60,40,.55), rgba(255,170,0,.25) 60%, transparent)",
                        filter: "blur(6px)",
                      }}
                    />
                  ))}
                  {boxes && (
                    <button
                      type="button"
                      onClick={() => onSelect?.(f.id)}
                      aria-label={`${f.label}, ${pct(f.confidence)}`}
                      className={cn("absolute border-2 transition-all", active ? "border-[#ffd24a] ring-2 ring-[#ffd24a]/50" : "border-[#46c6d0]")}
                      style={{ left: `${l}%`, top: `${t}%`, width: `${w}%`, height: `${h}%` }}
                    >
                      <span
                        className={cn(
                          "absolute -top-6 left-[-2px] whitespace-nowrap rounded px-1.5 py-0.5 text-[11px] font-medium text-black shadow-sm",
                          active ? "bg-[#ffd24a]" : "bg-[#46c6d0]"
                        )}
                        style={{ transform: `scale(${1 / zoom})`, transformOrigin: "left bottom" }}
                      >
                        {f.label} {pct(f.confidence)}
                      </span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
        <p className="flex items-center gap-1.5">
          <ScanSearch className="size-3.5" />
          {dims ? `Image ${dims.width} × ${dims.height} px` : "Loading image..."}
          {zoom > 1 && ` · ${zoom.toFixed(1)}× (drag to pan)`}
        </p>
        {unlocalizedCount > 0 && (
          <p className="flex items-center gap-1 text-warn">
            <AlertTriangle className="size-3" />
            {unlocalizedCount} observation{unlocalizedCount === 1 ? "" : "s"} without bounding box
          </p>
        )}
      </div>
    </div>
  );
}
