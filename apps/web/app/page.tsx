"use client";

import { ChessProvider, Board } from "@mdwebb/react-chess";
import { CodeBlock } from "@/components/CodeBlock";
import { FadeIn, Stagger, StaggerItem, motion } from "@/components/Motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMaxBoardSize } from "@/hooks/useMaxBoardSize";

const features = [
  { icon: "🎨", title: "Custom Themes", desc: "4 presets or design your own with live color pickers" },
  { icon: "📋", title: "PGN Support", desc: "Annotations, NAG symbols, comments, and metadata" },
  { icon: "🧩", title: "Compound API", desc: "Compose Board, MoveHistory, Navigation independently" },
  { icon: "♛", title: "Promotion UI", desc: "Visual piece selection — no more auto-queen" },
  { icon: "⌨️", title: "Keyboard Nav", desc: "Arrow keys and Home/End to step through moves" },
  { icon: "⚡", title: "Callbacks", desc: "onCheck, onGameOver, onIllegalMove, onPromotion" },
  { icon: "🔄", title: "Board Flip", desc: "Toggle orientation via button, prop, or ref" },
  { icon: "🔒", title: "TypeScript", desc: "Every prop, callback, and ref fully typed" },
];

const demos = [
  { title: "Basic Board", desc: "Drag-and-drop, flip, coordinates", href: "/demos/basic", icon: "♟" },
  { title: "PGN Viewer", desc: "Famous games with annotations", href: "/demos/pgn-viewer", icon: "📖" },
  { title: "Themes", desc: "Live color pickers", href: "/demos/theme-customizer", icon: "🎨" },
  { title: "Compound", desc: "Custom layouts", href: "/demos/compound", icon: "🧩" },
  { title: "Callbacks", desc: "Real-time events", href: "/demos/callbacks", icon: "⚡" },
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
      showBoardControls={true}
      onMove={(from, to, move) => {
        console.log(move.san);
      }}
      onGameOver={(result) => {
        alert(result.reason);
      }}
    />
  );
}`;

export default function Home() {
  const maxSize = useMaxBoardSize();
  const heroSize = Math.min(400, maxSize);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-14 pb-12 text-center sm:px-6">
        <div className="pointer-events-none absolute top-[-40%] left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(192,200,212,0.06)_0%,transparent_70%)]" />

        <FadeIn variant="fade-up" style={{ position: "relative" }}>
          <Badge variant="outline" className="mb-3 inline-flex">
            v2.0 — Compound Components + Custom Themes
          </Badge>
        </FadeIn>

        <FadeIn variant="fade-up" delay={0.05}>
          <h1 className="mb-2 bg-gradient-to-br from-(--fg) to-(--accent-site) bg-clip-text text-[clamp(2.5rem,6vw,3.25rem)] leading-none font-black tracking-tighter text-transparent">
            React Chess
          </h1>
        </FadeIn>

        <FadeIn variant="fade-up" delay={0.1}>
          <p className="mx-auto mb-8 max-w-lg text-base text-(--fg-secondary) sm:text-lg">
            A feature-rich, highly configurable chess board component. Built on
            chessground &amp; chess.js.
          </p>
        </FadeIn>

        <FadeIn variant="scale-in" delay={0.15}>
          <div className="inline-block">
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 20px rgba(192,200,212,0.05)",
                  "0 0 40px rgba(192,200,212,0.12)",
                  "0 0 20px rgba(192,200,212,0.05)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block rounded-lg"
            >
              <ChessProvider theme="brown" autoPromoteToQueen={true}>
                <Board width={heroSize} height={heroSize} />
              </ChessProvider>
            </motion.div>
          </div>
        </FadeIn>

        <FadeIn variant="fade-up" delay={0.25}>
          <div className="mt-6 flex justify-center gap-2.5">
            <a href="/demos/basic">
              <Button>Try the Demos</Button>
            </a>
            <a href="https://github.com/matt-d-webb/react-chess">
              <Button variant="outline">GitHub</Button>
            </a>
          </div>
        </FadeIn>
      </section>

      {/* Quick Start */}
      <section className="mx-auto max-w-[46rem] px-4 pt-12 pb-10 sm:px-6">
        <FadeIn className="mb-5 text-center">
          <h2 className="mb-1 text-2xl font-extrabold tracking-tight">Quick Start</h2>
          <p className="text-(--fg-secondary)">Install and render a board in seconds</p>
        </FadeIn>

        <FadeIn delay={0.1} className="mb-3">
          <div className="code-block" style={{ borderColor: "rgba(192,200,212,0.2)" }}>
            <div className="code-block__header">
              <span className="code-block__lang">Terminal</span>
            </div>
            <pre className="code-block__fallback" style={{ padding: "0.75rem 1.25rem" }}>
              <code className="text-(--accent-site)">npm install @mdwebb/react-chess</code>
            </pre>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <CodeBlock code={quickStart} language="tsx" title="App.tsx" />
        </FadeIn>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <FadeIn className="mb-6 text-center">
          <h2 className="mb-1 text-2xl font-extrabold tracking-tight">Features</h2>
          <p className="text-(--fg-secondary)">Everything you need for chess in React</p>
        </FadeIn>

        <Stagger className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-2.5">
          {features.map(({ icon, title, desc }) => (
            <StaggerItem key={title}>
              <Card className="h-full" size="sm">
                <CardContent>
                  <div className="mb-1.5 text-xl">{icon}</div>
                  <h3 className="mb-0.5 text-sm font-bold">{title}</h3>
                  <p className="text-xs leading-relaxed text-(--fg-secondary)">{desc}</p>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Demos */}
      <section className="mx-auto max-w-5xl px-4 pt-10 pb-12 sm:px-6">
        <FadeIn className="mb-6 text-center">
          <h2 className="mb-1 text-2xl font-extrabold tracking-tight">Interactive Demos</h2>
          <p className="text-(--fg-secondary)">Explore every feature live</p>
        </FadeIn>

        <Stagger className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2.5">
          {demos.map((demo) => (
            <StaggerItem key={demo.href}>
              <a href={demo.href} className="block h-full no-underline">
                <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(192,200,212,0.04)] hover:ring-[rgba(192,200,212,0.15)]" size="sm">
                  <CardContent>
                    <div className="mb-2 text-2xl">{demo.icon}</div>
                    <h3 className="mb-0.5 text-sm font-bold text-(--fg)">
                      {demo.title}
                      <span className="ml-1.5 text-(--accent-site)">→</span>
                    </h3>
                    <p className="text-xs text-(--fg-secondary)">{demo.desc}</p>
                  </CardContent>
                </Card>
              </a>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </div>
  );
}
