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
  ["Basic", "/demos/basic"],
  ["PGN Viewer", "/demos/pgn-viewer"],
  ["Themes", "/demos/theme-customizer"],
  ["Compound", "/demos/compound"],
  ["Callbacks", "/demos/callbacks"],
] as const;

function Logo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={26} height={26} fill="none">
      <rect width="32" height="32" rx="8" fill="#111118" />
      <rect x="0.5" y="0.5" width="31" height="31" rx="7.5" stroke="#c0c8d4" strokeOpacity="0.2" />
      <g transform="translate(4, 2) scale(0.54)">
        <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#c0c8d4" />
        <path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#c0c8d4" />
        <path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0z" fill="#111118" />
        <path d="M14.933 15.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5z" fill="#111118" />
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
    <nav className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-[rgba(10,10,14,0.8)] px-4 backdrop-blur-xl sm:px-6">
      <a
        href="/"
        className="flex items-center gap-2 text-[0.9375rem] font-extrabold tracking-tight text-(--fg)"
      >
        <Logo />
        <span>React Chess</span>
      </a>

      {/* Desktop links */}
      <div className="hidden gap-1 text-[0.8125rem] sm:flex">
        {links.map(([label, href]) => (
          <a
            key={href}
            href={href}
            className={cn(
              "rounded-md px-3 py-1.5 text-(--fg-secondary) transition-colors hover:bg-(--bg-tertiary) hover:text-(--fg)",
              pathname === href && "bg-(--bg-tertiary) text-(--fg)"
            )}
          >
            {label}
          </a>
        ))}
      </div>

      {/* Mobile sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon" className="sm:hidden" />
          }
        >
          <Menu className="size-5" />
          <span className="sr-only">Menu</span>
        </SheetTrigger>
        <SheetContent side="right" className="w-64 bg-(--bg-secondary) p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div className="flex flex-col gap-1 p-3 pt-12">
            {links.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-4 py-3 text-[0.9375rem] font-medium text-(--fg-secondary) transition-colors hover:bg-(--bg-tertiary) hover:text-(--fg)",
                  pathname === href && "bg-(--bg-tertiary) text-(--fg)"
                )}
              >
                {label}
              </a>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
