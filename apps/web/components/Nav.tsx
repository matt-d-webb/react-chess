"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const links = [
  ["Docs", "/docs"],
  ["Basic", "/demos/basic"],
  ["PGN", "/demos/pgn-viewer"],
  ["Themes", "/demos/theme-customizer"],
  ["Compound", "/demos/compound"],
  ["Callbacks", "/demos/callbacks"],
] as const;

function Logo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={22}
      height={22}
      fill="none"
      aria-hidden="true"
    >
      <rect x="0.5" y="0.5" width="31" height="31" rx="8" className="fill-(--card-bg) stroke-(--accent-site)" strokeOpacity="0.5" />
      <g transform="translate(4, 2) scale(0.54)">
        <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" className="fill-(--accent-site)" />
        <path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" className="fill-(--accent-site)" />
        <path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0z" className="fill-(--card-bg)" />
        <path d="M14.933 15.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5z" className="fill-(--card-bg)" />
      </g>
    </svg>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <nav
      className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border px-4 backdrop-blur-xl sm:px-6"
      style={{ background: "var(--nav-bg)" }}
    >
      <a
        href="/"
        className="group flex items-center gap-2.5 text-[0.7rem] font-bold tracking-[0.2em] text-(--fg) uppercase"
      >
        <Logo />
        <span>react_chess</span>
        <span className="hidden text-(--muted-text) sm:inline">//</span>
        <span className="hidden text-(--muted-text) sm:inline">v2.0.4</span>
      </a>

      {/* Desktop links */}
      <div className="hidden items-center gap-0.5 text-[0.7rem] font-medium tracking-[0.12em] uppercase sm:flex">
        {links.map(([label, href]) => (
          <a
            key={href}
            href={href}
            className={cn(
              "relative rounded-sm px-3 py-1.5 text-(--fg-secondary) transition-colors hover:text-(--accent-site)",
              pathname === href && "text-(--accent-site)"
            )}
          >
            {pathname === href && (
              <span
                aria-hidden
                className="absolute inset-x-2 -bottom-px h-px bg-(--accent-site)"
                style={{ boxShadow: "0 0 12px var(--accent-glow-strong)" }}
              />
            )}
            {label}
          </a>
        ))}
        <div className="mx-2 h-4 w-px bg-border" />
        <div className="flex items-center gap-1.5 px-2 text-[0.6rem] tracking-[0.18em] text-(--success)">
          <span className="pulse-dot pulse-dot-success" aria-hidden />
          <span>ONLINE</span>
        </div>
      </div>

      {/* Mobile */}
      <div className="flex items-center gap-1 sm:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger render={<Button variant="ghost" size="icon" />}>
            <Menu className="size-5" />
            <span className="sr-only">Menu</span>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-64 border-l-border bg-(--bg-secondary) p-0"
          >
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="flex flex-col gap-0.5 p-3 pt-12">
              {links.map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-sm px-4 py-3 text-[0.75rem] font-medium tracking-[0.12em] uppercase text-(--fg-secondary) transition-colors hover:bg-(--accent-soft) hover:text-(--accent-site)",
                    pathname === href && "bg-(--accent-soft) text-(--accent-site)"
                  )}
                >
                  {label}
                </a>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
