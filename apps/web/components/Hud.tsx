import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ─── HudFrame ───────────────────────────────────────────────────────
 * Inline wrapper retained for call-site compatibility. The decorative
 * corner brackets were removed; this is now an inline-block passthrough. */
export function HudFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
  /** Deprecated — kept so existing call sites compile. */
  tone?: "cyan" | "amber";
}) {
  return <div className={cn("relative inline-block", className)}>{children}</div>;
}

/* ─── PulseDot ─────────────────────────────────────────────────────── */
export function PulseDot({
  tone = "cyan",
  className,
}: {
  tone?: "cyan" | "amber" | "success";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "pulse-dot",
        tone === "amber" && "pulse-dot-amber",
        tone === "success" && "pulse-dot-success",
        className
      )}
      aria-hidden
    />
  );
}

/* ─── SectionTitle ───────────────────────────────────────────────────
 * HUD-style section heading: "// 02  features".
 * Renders an index, the title, and an animated underline. */
export function SectionTitle({
  index,
  label,
  title,
  description,
  align = "left",
}: {
  index: string;
  label: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("mb-8", align === "center" ? "text-center" : "text-left")}>
      <div
        className={cn(
          "mb-3 inline-flex items-center gap-2 font-mono text-[0.65rem] tracking-[0.22em] text-(--fg-secondary) uppercase",
          align === "center" && "justify-center"
        )}
      >
        <span className="text-(--muted-text)">//</span>
        <span className="text-(--muted-text)">{index}</span>
        <span>{label}</span>
      </div>
      <h2
        className={cn(
          "mb-3 text-2xl font-extrabold tracking-tight text-(--fg) sm:text-3xl",
          align === "center" && "mx-auto"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "max-w-xl text-sm text-(--fg-secondary)",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

/* ─── StatusReadout ──────────────────────────────────────────────────
 * Monospaced HUD-style key/value stat. */
export function StatusReadout({
  label,
  value,
  tone = "cyan",
}: {
  label: string;
  value: ReactNode;
  tone?: "cyan" | "amber" | "success";
}) {
  const color =
    tone === "amber"
      ? "text-(--accent-amber)"
      : tone === "success"
      ? "text-(--success)"
      : "text-(--accent-site)";
  return (
    <div className="flex flex-col gap-0.5 font-mono">
      <span className="text-[0.6rem] tracking-[0.18em] text-(--muted-text) uppercase">
        {label}
      </span>
      <span className={cn("stat-readout text-base font-bold", color)}>
        {value}
      </span>
    </div>
  );
}

/* ─── Chip ───────────────────────────────────────────────────────────
 * Compact terminal-style tag (e.g. "[ v2.0.4 ]"). */
export function Chip({
  children,
  tone = "cyan",
  className,
}: {
  children: ReactNode;
  tone?: "cyan" | "amber";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-[0.65rem] tracking-[0.16em] uppercase",
        tone === "amber"
          ? "border-(--accent-amber)/40 text-(--accent-amber)"
          : "border-(--accent-site)/40 text-(--accent-site)",
        className
      )}
    >
      {children}
    </span>
  );
}
