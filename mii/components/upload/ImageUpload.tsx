"use client";
import { useRef, useState } from "react";
import { Maximize2, Replace, Trash2, UploadCloud, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui";
import { ACCEPTED_TYPES, MAX_BYTES, cn, formatBytes } from "@/lib/utils";

interface Props {
  file: File | null; previewUrl: string | null; dims: { width: number; height: number } | null;
  onSelect: (f: File) => void; onRemove: () => void; onError: (msg: string) => void; disabled?: boolean;
}
export function ImageUpload({ file, previewUrl, dims, onSelect, onRemove, onError, disabled }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const [over, setOver] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  const take = (f?: File) => {
    if (!f) return;
    if (!ACCEPTED_TYPES.includes(f.type)) return onError("Unsupported image. Use a PNG, JPG, JPEG or WEBP file.");
    if (f.size > MAX_BYTES) return onError(`File too large (${formatBytes(f.size)}). The limit is 10 MB.`);
    onSelect(f);
  };
  const hidden = (
    <input ref={input} type="file" accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp" className="sr-only"
      onChange={(e) => { take(e.target.files?.[0]); e.target.value = ""; }} />
  );

  if (!file || !previewUrl) {
    return (
      <div
        onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); take(e.dataTransfer.files?.[0]); }}
        className={cn("grid min-h-72 place-items-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition", over ? "border-brand bg-brand/5" : "border-line")}>
        <div>
          <UploadCloud className="mx-auto size-10 text-brand" />
          <p className="mt-3 font-medium">Drag &amp; drop medical image</p>
          <p className="text-sm text-muted">or <button type="button" disabled={disabled} onClick={() => input.current?.click()} className="font-medium text-brand underline underline-offset-2">browse files</button></p>
          <p className="mt-3 text-xs text-muted">PNG, JPG, JPEG or WEBP, up to 10 MB</p>
        </div>
        {hidden}
      </div>
    );
  }
  return (
    <div>
      <div ref={box} className="max-h-[28rem] overflow-auto rounded-xl bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={previewUrl} alt="Uploaded medical image preview" className={cn("mx-auto max-h-[28rem] object-contain", zoomed && "max-h-none w-[200%] max-w-none")} />
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted"><span className="font-medium text-ink">{file.name}</span> &middot; {formatBytes(file.size)}{dims && <> &middot; {dims.width} &times; {dims.height} px</>}</p>
        <div className="flex gap-1">
          <Button variant="outline" disabled={disabled} onClick={() => input.current?.click()}><Replace className="size-4" />Replace</Button>
          <Button variant="outline" onClick={() => setZoomed((z) => !z)} aria-pressed={zoomed}><ZoomIn className="size-4" />Zoom</Button>
          <Button variant="outline" onClick={() => box.current?.requestFullscreen?.()} aria-label="Fullscreen"><Maximize2 className="size-4" /></Button>
          <Button variant="outline" disabled={disabled} onClick={onRemove} aria-label="Remove image"><Trash2 className="size-4" /></Button>
        </div>
      </div>
      {hidden}
    </div>
  );
}
