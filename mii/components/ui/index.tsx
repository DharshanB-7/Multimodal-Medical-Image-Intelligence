import Link from "next/link";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-brand text-brand-ink hover:opacity-90",
  outline: "border border-line bg-surface text-ink hover:bg-bg",
  ghost: "text-muted hover:bg-bg hover:text-ink",
};
type BtnProps = { variant?: keyof typeof variants; className?: string; children: React.ReactNode };
const base = "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition disabled:opacity-50 disabled:pointer-events-none";

export function Button({ variant = "primary", className, ...p }: BtnProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn(base, variants[variant], className)} {...p} />;
}
export function ButtonLink({ variant = "primary", className, href, children }: BtnProps & { href: string }) {
  return <Link href={href} className={cn(base, variants[variant], className)}>{children}</Link>;
}
export function Card({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-2xl border border-line bg-surface p-5 sm:p-6", className)} {...p} />;
}
export function CardTitle({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-base font-semibold">{children}</h2>
      {hint && <p className="mt-0.5 text-sm text-muted">{hint}</p>}
    </div>
  );
}
export const inputClass =
  "w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm placeholder:text-muted/70 focus:border-brand focus:outline-none disabled:opacity-60";
export function Field({ label, children, optional }: { label: string; children: React.ReactNode; optional?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}{optional && <span className="ml-1 font-normal text-muted">(optional)</span>}</span>
      {children}
    </label>
  );
}
