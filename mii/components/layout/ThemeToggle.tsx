"use client";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui";

export function ThemeToggle() {
  const toggle = () => {
    const dark = document.documentElement.classList.toggle("dark");
    try { localStorage.setItem("mii.theme", dark ? "dark" : "light"); } catch { /* ignore */ }
  };
  return (
    <Button variant="ghost" onClick={toggle} aria-label="Toggle light or dark theme" className="px-2.5">
      <Sun className="hidden size-4 dark:block" /><Moon className="size-4 dark:hidden" />
    </Button>
  );
}
