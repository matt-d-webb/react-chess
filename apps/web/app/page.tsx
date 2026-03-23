"use client";

import { ChessProvider, Board } from "@mdwebb/react-chess";
import { CodeBlock } from "@/components/CodeBlock";
import { FadeIn, Stagger, StaggerItem } from "@/components/Motion";
import { NetworkBackground } from "@/components/NetworkBackground";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMaxBoardSize } from "@/hooks/useMaxBoardSize";

const features = [
  { title: "custom_themes", desc: "4 presets or build your own with live pickers" },
  { title: "pgn_support", desc: "Annotations, NAG symbols, comments, metadata" },
  { title: "compound_api", desc: "Compose Board, MoveHistory, Navigation" },
  { title: "promotion_ui", desc: "Visual piece selection dialog" },
  { title: "keyboard_nav", desc: "Arrow keys to step through moves" },
  { title: "callbacks", desc: "onCheck, onGameOver, onIllegalMove" },
  { title: "board_flip", desc: "Toggle via button, prop, or ref" },
  { title: "typescript", desc: "Every prop, callback, and ref typed" },
];

const demos = [
  { title: "basic", desc: "Drag-and-drop, flip, coordinates", href: "/demos/basic" },
  { title: "pgn_viewer", desc: "Famous games with annotations", href: "/demos/pgn-viewer" },
  { title: "themes", desc: "Live color customization", href: "/demos/theme-customizer" },
  { title: "compound", desc: "Custom component layouts", href: "/demos/compound" },
  { title: "callbacks", desc: "Real-time event logging", href: "/demos/callbacks" },
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

export default function Home() {
  const maxSize = useMaxBoardSize();
  const heroSize = Math.min(380, maxSize);

  return (
    <div>
      {/* Hero */}
      <section className="bg-grid scanlines relative overflow-hidden px-4 pt-16 pb-16 text-center sm:px-6">
        {/* Network background */}
        <div className="pointer-events-none absolute inset-0 opacity-50">
          <NetworkBackground />
        </div>

        <div className="relative">
          <FadeIn variant="fade-up">
            <div className="mb-6 inline-block">
              <Badge variant="outline" className="border-(--accent-site)/20 font-mono text-xs tracking-widest text-(--accent-site) uppercase">
                v2.0 // compound + themes
              </Badge>
            </div>
          </FadeIn>

          <FadeIn variant="fade-up" delay={0.05}>
            <h1 className="mb-2 text-[clamp(2rem,5vw,3rem)] leading-none font-black tracking-tight text-(--accent-site)">
              react-chess
            </h1>
          </FadeIn>

          <FadeIn variant="fade-up" delay={0.1}>
            <p className="mx-auto mb-10 max-w-md text-sm leading-relaxed text-(--fg-secondary)">
              Feature-rich chess board component for React.
              <br />
              Built on chessground &amp; chess.js.
            </p>
          </FadeIn>

          {/* Board - NO animation wrappers */}
          <div className="glow-border mb-10 inline-block rounded-md border border-border">
            <ChessProvider theme="brown" autoPromoteToQueen={true}>
              <Board width={heroSize} height={heroSize} />
            </ChessProvider>
          </div>

          <FadeIn variant="fade-up" delay={0.2}>
            <div className="flex justify-center gap-3">
              <a href="/demos/basic">
                <Button size="lg" className="font-mono text-xs tracking-wider uppercase transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_var(--accent-glow)]">
                  ./demos
                </Button>
              </a>
              <a href="https://github.com/matt-d-webb/react-chess">
                <Button variant="outline" size="lg" className="font-mono text-xs tracking-wider uppercase transition-all hover:-translate-y-0.5 hover:border-(--accent-site) hover:text-(--accent-site)">
                  github
                </Button>
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Quick Start */}
      <section className="mx-auto max-w-[46rem] px-4 pt-16 pb-12 sm:px-6">
        <FadeIn className="mb-6 text-center">
          <h2 className="mb-1 text-lg font-bold tracking-tight text-(--accent-site)">$ quick-start</h2>
          <p className="text-xs text-(--fg-secondary)">Install and render in seconds</p>
        </FadeIn>

        <FadeIn delay={0.1} className="mb-3">
          <div className="code-block glow-border">
            <div className="code-block__header">
              <span className="code-block__lang">terminal</span>
            </div>
            <pre className="code-block__fallback" style={{ padding: "0.75rem 1.25rem" }}>
              <code className="text-(--accent-site)">$ npm install @mdwebb/react-chess</code>
            </pre>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <CodeBlock code={quickStart} language="tsx" title="app.tsx" />
        </FadeIn>
      </section>

      {/* Features */}
      <section className="bg-grid mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <FadeIn className="mb-8 text-center">
          <h2 className="mb-1 text-lg font-bold tracking-tight text-(--accent-site)">$ features --list</h2>
          <p className="text-xs text-(--fg-secondary)">Everything included</p>
        </FadeIn>

        <Stagger className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-2">
          {features.map(({ title, desc }) => (
            <StaggerItem key={title}>
              <div className="glow-border rounded-md border border-border/50 bg-(--card-bg) px-4 py-3 transition-all hover:border-(--accent-site)/20 hover:bg-(--card-bg-hover)">
                <h3 className="mb-1 text-xs font-bold text-(--accent-site)">{title}</h3>
                <p className="text-[0.7rem] leading-relaxed text-(--fg-secondary)">{desc}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Demos */}
      <section className="mx-auto max-w-5xl px-4 pt-10 pb-16 sm:px-6">
        <FadeIn className="mb-8 text-center">
          <h2 className="mb-1 text-lg font-bold tracking-tight text-(--accent-site)">$ demos --interactive</h2>
          <p className="text-xs text-(--fg-secondary)">Explore every feature live</p>
        </FadeIn>

        <Stagger className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2">
          {demos.map((demo) => (
            <StaggerItem key={demo.href}>
              <a href={demo.href} className="group block h-full no-underline">
                <div className="glow-border h-full rounded-md border border-border/50 bg-(--card-bg) px-4 py-3 transition-all hover:border-(--accent-site)/20 hover:bg-(--card-bg-hover)">
                  <h3 className="mb-1 text-xs font-bold text-(--fg)">
                    <span className="text-(--accent-site)">./</span>{demo.title}
                    <span className="ml-1 inline-block text-(--accent-site) transition-transform group-hover:translate-x-0.5">→</span>
                  </h3>
                  <p className="text-[0.7rem] text-(--fg-secondary)">{demo.desc}</p>
                </div>
              </a>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </div>
  );
}
