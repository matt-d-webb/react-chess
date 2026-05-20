"use client";

import { ChessProvider, Board, useChess } from "@mdwebb/react-chess";
import { CodeBlock } from "@/components/CodeBlock";
import {
  Chip,
  HudFrame,
  PulseDot,
  SectionTitle,
  StatusReadout,
} from "@/components/Hud";
import { Button } from "@/components/ui/button";
import { useMaxBoardSize } from "@/hooks/useMaxBoardSize";

const features = [
  {
    idx: "01",
    title: "custom_themes",
    desc: "4 presets or build your own with live pickers.",
  },
  {
    idx: "02",
    title: "pgn_support",
    desc: "Annotations, NAG symbols, comments, metadata.",
  },
  {
    idx: "03",
    title: "compound_api",
    desc: "Compose Board, MoveHistory, Navigation.",
  },
  { idx: "04", title: "promotion_ui", desc: "Visual piece selection dialog." },
  {
    idx: "05",
    title: "keyboard_nav",
    desc: "Arrow keys to step through moves.",
  },
  {
    idx: "06",
    title: "callbacks",
    desc: "onCheck, onGameOver, onIllegalMove, more.",
  },
  { idx: "07", title: "board_flip", desc: "Toggle via button, prop, or ref." },
  {
    idx: "08",
    title: "typescript",
    desc: "Every prop, callback, and ref strongly typed.",
  },
];

const demos = [
  {
    idx: "01",
    title: "basic",
    desc: "Drag, flip, coordinates, layouts.",
    href: "/demos/basic",
  },
  {
    idx: "02",
    title: "pgn_viewer",
    desc: "Famous games with annotations.",
    href: "/demos/pgn-viewer",
  },
  {
    idx: "03",
    title: "theme_customizer",
    desc: "Live color pickers.",
    href: "/demos/theme-customizer",
  },
  {
    idx: "04",
    title: "compound",
    desc: "Custom component layouts.",
    href: "/demos/compound",
  },
  {
    idx: "05",
    title: "callbacks",
    desc: "Real-time event logging.",
    href: "/demos/callbacks",
  },
];

const quickStart = `import { Chessboard } from "@mdwebb/react-chess";
import "@mdwebb/react-chess/styles";

function App() {
  return (
    <Chessboard
      width={500}
      height={500}
      theme="brown"
      showMoveHistory={true}
      showNavigation={true}
      onMove={(from, to, move) => {
        console.log(move.san);
      }}
    />
  );
}`;

/* ─── HeroTelemetry ──────────────────────────────────────────────────
 * Lives inside ChessProvider; reads context to show real-time stats
 * next to the hero board. */
function HeroTelemetry() {
  const { game, moveHistory, currentMoveIndex, isCheck } = useChess();
  const lastSan = moveHistory[currentMoveIndex]?.san;
  const turn = game?.turn() === "w" ? "white" : "black";

  return (
    <div className="grid w-full max-w-md grid-cols-4 gap-3 rounded-lg border border-(--border) bg-(--card-bg) px-4 py-3">
      <StatusReadout
        label="MOVES"
        value={moveHistory.length.toString().padStart(3, "0")}
      />
      <StatusReadout label="LAST" value={lastSan ?? "—"} />
      <StatusReadout label="TURN" value={turn.toUpperCase().slice(0, 5)} />
      <StatusReadout
        label="STATE"
        value={isCheck ? "CHECK" : "OK"}
        tone={isCheck ? "amber" : "success"}
      />
    </div>
  );
}

export default function Home() {
  const maxSize = useMaxBoardSize();
  const heroSize = Math.min(420, maxSize);

  return (
    <div>
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border bg-(--bg)">
        <div className="bg-grid scanlines absolute inset-0" aria-hidden />

        {/* Top corner readouts */}
        <div className="pointer-events-none absolute top-3 left-0 right-0 z-10 flex items-start justify-between px-4 font-mono text-[0.6rem] tracking-[0.18em] text-(--muted-text) uppercase sm:px-6">
          <span>// component.boot</span>
          <span className="hidden sm:inline">// react.chess.runtime</span>
        </div>

        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-4 pt-16 pb-20 text-center sm:px-6">
          <Chip className="mb-5">v2.0.4 // compound + themes</Chip>

          <h1 className="mb-3 text-[clamp(2.2rem,6vw,4rem)] leading-[0.95] font-black tracking-tight text-(--fg)">
            react<span className="text-(--muted-text)">_</span>chess
          </h1>

          <p className="mx-auto mb-10 text-sm leading-relaxed text-(--fg-secondary) sm:text-base">
            A feature-rich, fully-typed chess board component for React.
          </p>

          {/* Board + telemetry. NO motion wrappers on the board itself. */}
          <ChessProvider theme="brown" autoPromoteToQueen={true}>
            <div className="mb-6 flex flex-col items-center gap-3">
              <HudFrame>
                <Board width={heroSize} height={heroSize} />
              </HudFrame>
              <HeroTelemetry />
            </div>
          </ChessProvider>

          <div className="flex flex-wrap justify-center gap-3">
            <a href="/docs">
              <Button
                size="lg"
                className="border border-(--accent-site) bg-(--accent-site) font-mono text-[0.7rem] tracking-[0.18em] uppercase transition-colors hover:bg-(--accent-hover)"
              >
                &gt; READ_DOCS
              </Button>
            </a>
            <a href="/demos/basic">
              <Button
                variant="outline"
                size="lg"
                className="border-(--border-strong) font-mono text-[0.7rem] tracking-[0.18em] uppercase transition-colors hover:border-(--accent-site) hover:text-(--accent-site)"
              >
                ./run_demos
              </Button>
            </a>
            <a href="https://github.com/matt-d-webb/react-chess">
              <Button
                variant="ghost"
                size="lg"
                className="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-(--fg-secondary) hover:text-(--accent-site)"
              >
                github //
              </Button>
            </a>
          </div>
        </div>

        {/* Bottom hairline + region label */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 flex items-end justify-between px-4 pb-2 font-mono text-[0.6rem] tracking-[0.18em] text-(--muted-text) uppercase sm:px-6">
          <span className="flex items-center gap-2">
            <PulseDot tone="success" />
            engine_ready
          </span>
          <span>build // v2.0.4</span>
        </div>
      </section>

      {/* ─── Quick start ──────────────────────────────────────── */}
      <section className="relative mx-auto max-w-[46rem] px-4 pt-20 pb-12 sm:px-6">
        <SectionTitle
          index="01"
          label="install"
          title="Quick start"
          description="Render a fully-featured chess board in seconds."
          align="center"
        />

        <div className="code-block mb-3">
          <div className="code-block__header">
            <span className="code-block__lang">terminal</span>
            <span className="text-[0.6rem] tracking-[0.16em] text-(--muted-text) uppercase">
              pnpm · npm · yarn
            </span>
          </div>
          <pre
            className="code-block__fallback"
            style={{ padding: "0.75rem 1.25rem" }}
          >
            <code>
              <span className="text-slate-400">$</span>{" "}
              <span className="text-slate-100">
                pnpm add @mdwebb/react-chess
              </span>
            </code>
          </pre>
        </div>

        <CodeBlock code={quickStart} language="tsx" title="app.tsx" />
      </section>

      {/* ─── Features ─────────────────────────────────────────── */}
      <section className="bg-grid-fine relative border-y border-border bg-(--bg-secondary) py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <SectionTitle
            index="02"
            label="capabilities"
            title="Every feature, batteries-included"
            description="Eight headline capabilities; zero configuration required to start."
            align="center"
          />

          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
            {features.map(({ idx, title, desc }) => (
              <div
                key={title}
                className="group glow-border relative rounded-lg border border-border bg-(--card-bg) p-4 transition-colors"
              >
                {/* Hover-only corners */}
                <span
                  className="absolute top-1.5 left-1.5 h-2 w-2 border-t border-l border-(--accent-site) opacity-0 transition-opacity group-hover:opacity-100"
                  aria-hidden
                />
                <span
                  className="absolute top-1.5 right-1.5 h-2 w-2 border-t border-r border-(--accent-site) opacity-0 transition-opacity group-hover:opacity-100"
                  aria-hidden
                />
                <span
                  className="absolute bottom-1.5 left-1.5 h-2 w-2 border-b border-l border-(--accent-site) opacity-0 transition-opacity group-hover:opacity-100"
                  aria-hidden
                />
                <span
                  className="absolute bottom-1.5 right-1.5 h-2 w-2 border-b border-r border-(--accent-site) opacity-0 transition-opacity group-hover:opacity-100"
                  aria-hidden
                />

                <div className="mb-2 flex items-center justify-between">
                  <span className="font-mono text-[0.6rem] tracking-[0.16em] text-(--muted-text)">
                    {idx}
                  </span>
                  <PulseDot tone="success" />
                </div>
                <h3 className="mb-1 font-mono text-[0.78rem] font-bold text-(--accent-site)">
                  {title}
                </h3>
                <p className="text-[0.78rem] leading-relaxed text-(--fg-secondary)">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Demos ────────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-5xl px-4 pt-20 pb-24 sm:px-6">
        <SectionTitle
          index="03"
          label="interactive"
          title="Explore the demos"
          description="Every demo is a fully-working playground built with the public API."
          align="center"
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {demos.map((demo) => (
            <a
              key={demo.href}
              href={demo.href}
              className="group block h-full text-(--fg) no-underline"
            >
              <div className="glow-border relative h-full overflow-hidden rounded-lg border border-border bg-(--card-bg) p-5 transition-colors hover:border-(--accent-site)">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-[0.6rem] tracking-[0.18em] text-(--muted-text)">
                    DEMO // {demo.idx}
                  </span>
                  <span className="font-mono text-[0.6rem] tracking-[0.18em] text-(--fg-secondary)">
                    RUN
                  </span>
                </div>

                <h3 className="mb-1 font-mono text-base font-bold">
                  <span className="text-(--muted-text)">./</span>
                  <span>{demo.title}</span>
                </h3>
                <p className="mb-4 text-[0.8rem] text-(--fg-secondary)">
                  {demo.desc}
                </p>

                <div className="flex items-center justify-between border-t border-border pt-3 font-mono text-[0.65rem] tracking-[0.16em] uppercase">
                  <span className="flex items-center gap-1.5 text-(--success)">
                    <PulseDot tone="success" /> live
                  </span>
                  <span className="text-(--fg-secondary) transition-transform group-hover:translate-x-1 group-hover:text-(--accent-site)">
                    open →
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ─── Spec strip ───────────────────────────────────────── */}
      <section className="border-t border-border bg-(--bg-secondary)">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-px bg-border sm:grid-cols-4">
          {[
            { label: "version", value: "v2.0.4" },
            { label: "types", value: "100%" },
            { label: "engine", value: "chess.js" },
            { label: "render", value: "chessground" },
          ].map((s) => (
            <div key={s.label} className="bg-(--bg-secondary) px-5 py-5">
              <StatusReadout label={s.label} value={s.value} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
