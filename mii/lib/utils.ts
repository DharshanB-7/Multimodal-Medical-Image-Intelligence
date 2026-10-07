export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
export const pct = (v: number | null | undefined) =>
  typeof v === "number" && !isNaN(v) ? `${Math.round(v * 100)}%` : "N/A";
export const formatBytes = (b: number) =>
  b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(1)} MB`;
export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
export const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

export const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];
export const MAX_BYTES = 10 * 1024 * 1024;

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = () => rej(new Error("Could not read image"));
    img.src = src;
  });
}
/** Downscaled JPEG data URL (keeps sessionStorage small) plus the ORIGINAL pixel size. */
export async function toDataUrl(file: File, maxDim: number) {
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await loadImage(objectUrl);
    const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement("canvas");
    c.width = Math.round(img.naturalWidth * scale);
    c.height = Math.round(img.naturalHeight * scale);
    c.getContext("2d")?.drawImage(img, 0, 0, c.width, c.height);
    return { url: c.toDataURL("image/jpeg", 0.85), width: img.naturalWidth, height: img.naturalHeight };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
