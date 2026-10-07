import { Activity, Layers, MessageSquareText, ScanSearch, ShieldCheck, Upload } from "lucide-react";
import { ButtonLink } from "@/components/ui";
import { Disclaimer } from "@/components/layout/Disclaimer";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const steps = [
  { icon: Upload, t: "Upload an image", d: "Add a PNG, JPG or WEBP medical image. Nothing is sent until you choose to analyze." },
  { icon: MessageSquareText, t: "Add clinical context", d: "Enter age, sex, symptoms, notes and test results." },
  { icon: ScanSearch, t: "Review AI-assisted findings", d: "See possible findings with confidence, location and explanation." },
];
const features = [
  ["Region highlighting", "Bounding boxes and heatmap overlays drawn on the exact image region."],
  ["Visual and clinical evidence", "Each finding shows what in the image and the patient context supports it."],
  ["Confidence per finding", "Scores for every observation, with a threshold you control."],
  ["Second-opinion workflow", "Built to support a clinician's review, never to replace it."],
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <span className="flex items-center gap-2.5 font-semibold"><span className="grid size-8 place-items-center rounded-lg bg-brand text-brand-ink"><Activity className="size-4" /></span>Medical Image Intelligence</span>
        <div className="flex items-center gap-2"><ThemeToggle /><ButtonLink href="/dashboard">Start Analysis</ButtonLink></div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-12 lg:grid-cols-[1.1fr_1fr] lg:py-20">
        <div>
          <p className="mb-4 inline-block rounded-full border border-line bg-surface px-3 py-1 text-sm text-muted">Clinical Decision Support · Second Opinion</p>
          <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">Multimodal Medical Image Intelligence</h1>
          <p className="mt-5 max-w-xl text-lg text-muted">AI-assisted medical image analysis combining visual evidence with clinical context.</p>
          <div className="mt-8"><ButtonLink href="/dashboard" className="px-6 py-3 text-base">Start Analysis</ButtonLink></div>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-4" aria-hidden>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#05090d]">
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 30% 45% at 32% 50%, #2b3a47, transparent 70%), radial-gradient(ellipse 30% 45% at 68% 50%, #2b3a47, transparent 70%)" }} />
            <div className="absolute left-[56%] top-[48%] h-[26%] w-[24%] rounded-sm border-2 border-[#46c6d0]" style={{ boxShadow: "0 0 40px rgba(255,90,40,.35) inset" }}>
              <span className="absolute -top-6 left-[-2px] rounded bg-[#46c6d0] px-1.5 py-0.5 text-[11px] font-medium text-black">Possible opacity 87%</span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm"><span className="font-medium">Possible abnormal region</span><span className="text-muted">Consider reviewing</span></div>
        </div>
      </section>

      <section className="border-y border-line bg-surface"><div className="mx-auto max-w-6xl px-5 py-14">
        <h2 className="text-2xl font-semibold">How it works</h2>
        <ol className="mt-8 grid gap-6 md:grid-cols-3">
          {steps.map(({ icon: I, t, d }, n) => (
            <li key={t}><div className="mb-3 flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-brand text-sm font-semibold text-brand-ink">{n + 1}</span><I className="size-5 text-muted" /></div>
              <h3 className="font-semibold">{t}</h3><p className="mt-1 text-sm text-muted">{d}</p></li>
          ))}
        </ol></div></section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <h2 className="text-2xl font-semibold">Features</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {features.map(([t, d]) => <div key={t} className="rounded-2xl border border-line bg-surface p-5"><Layers className="mb-3 size-5 text-brand" /><h3 className="font-semibold">{t}</h3><p className="mt-1 text-sm text-muted">{d}</p></div>)}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-14">
        <h2 className="text-2xl font-semibold">Technology</h2>
        <p className="mt-3 max-w-2xl text-muted">A Next.js frontend talks to a separate backend over a documented REST API. The backend runs the MedGemma 1.5 4B multimodal model locally, so images stay on your own machine.</p>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-14"><div className="mb-3 flex items-center gap-2 font-semibold"><ShieldCheck className="size-5 text-brand" />Safety</div><Disclaimer /></section>

      <section className="border-t border-line bg-surface"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-12">
        <h2 className="text-2xl font-semibold">Try an analysis with sample context</h2><ButtonLink href="/dashboard" className="px-6 py-3 text-base">Start Analysis</ButtonLink></div></section>
    </div>
  );
}
