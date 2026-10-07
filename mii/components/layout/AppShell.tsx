"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, FilePlus2, History, Info, LayoutDashboard, Settings } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { ModelStatusBadge } from "./ModelStatusBadge";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard#upload", label: "New Analysis", icon: FilePlus2 },
  { href: "/history", label: "Analysis History", icon: History },
  { href: "/about", label: "About", icon: Info },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const active = (href: string) => !href.includes("#") && (path === href || (href === "/dashboard" && path === "/analysis"));
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="relative flex flex-col border-b border-line bg-surface lg:sticky lg:top-0 lg:h-screen lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between px-5 py-4 lg:py-6">
          <Link href="/" className="flex items-center gap-2.5 font-semibold">
            <span className="grid size-8 place-items-center rounded-lg bg-brand text-brand-ink"><Activity className="size-4" /></span>
            <span className="leading-tight">Medical Image<br /><span className="text-xs font-normal text-muted">Intelligence</span></span>
          </Link>
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>

        <div className="px-3 pb-3 lg:hidden">
          <ModelStatusBadge />
        </div>

        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:pb-0" aria-label="Main">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link key={label} href={href}
              className={cn("flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm", active(href) ? "bg-bg font-medium text-ink" : "text-muted hover:bg-bg hover:text-ink")}>
              <Icon className="size-4" />{label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto hidden p-4 lg:block space-y-3">
          <ModelStatusBadge />
          <ThemeToggle />
        </div>
      </aside>
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-8 sm:py-8">{children}</main>
    </div>
  );
}
