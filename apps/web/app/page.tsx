"use client";

import { Chessboard } from "@mdwebb/react-chess";
import { CodeBlock } from "@/components/CodeBlock";
import { FadeIn, Stagger, StaggerItem, motion } from "@/components/Motion";

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
  return (
    <div>
      {/* Hero */}
      <section
        style={{
          position: "relative",
          padding: "3.5rem 1.5rem 3rem",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-40%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "700px",
            height: "700px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(192,200,212,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <FadeIn variant="fade-up" style={{ position: "relative" }}>
          <span className="badge badge--accent" style={{ marginBottom: "0.75rem", display: "inline-flex" }}>
            v2.0 — Compound Components + Custom Themes
          </span>
        </FadeIn>

        <FadeIn variant="fade-up" delay={0.05}>
          <h1
            style={{
              fontSize: "clamp(2.5rem, 6vw, 3.25rem)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              marginBottom: "0.5rem",
              lineHeight: 1.05,
              background: "linear-gradient(135deg, var(--fg) 0%, var(--accent) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            React Chess
          </h1>
        </FadeIn>

        <FadeIn variant="fade-up" delay={0.1}>
          <p
            style={{
              fontSize: "1.0625rem",
              color: "var(--fg-secondary)",
              maxWidth: "32rem",
              margin: "0 auto 2rem",
            }}
          >
            A feature-rich, highly configurable chess board component.
            Built on chessground & chess.js.
          </p>
        </FadeIn>

        <FadeIn variant="scale-in" delay={0.15}>
          <div style={{ display: "inline-block" }}>
            <motion.div
              animate={{ boxShadow: ["0 0 20px rgba(192,200,212,0.05)", "0 0 40px rgba(192,200,212,0.12)", "0 0 20px rgba(192,200,212,0.05)"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{ borderRadius: "var(--radius)", display: "inline-block" }}
            >
              <Chessboard
                width={360}
                height={360}
                theme="brown"
                showCoordinates={true}
                autoPromoteToQueen={true}
              />
            </motion.div>
          </div>
        </FadeIn>

        <FadeIn variant="fade-up" delay={0.25} style={{ marginTop: "1.5rem" }}>
          <div style={{ display: "flex", gap: "0.625rem", justifyContent: "center" }}>
            <a href="/demos/basic" className="btn btn--primary">
              Try the Demos
            </a>
            <a href="https://github.com/matt-d-webb/react-chess" className="btn btn--outline">
              GitHub
            </a>
          </div>
        </FadeIn>
      </section>

      {/* Quick Start */}
      <section style={{ padding: "3rem 1.5rem 2.5rem", maxWidth: "46rem", margin: "0 auto" }}>
        <FadeIn style={{ textAlign: "center", marginBottom: "1.25rem" }}>
          <h2 className="section-title">Quick Start</h2>
          <p className="section-subtitle">Install and render a board in seconds</p>
        </FadeIn>

        <FadeIn delay={0.1} style={{ marginBottom: "0.75rem" }}>
          <div className="code-block" style={{ borderColor: "rgba(192,200,212,0.2)" }}>
            <div className="code-block__header">
              <span className="code-block__lang">Terminal</span>
            </div>
            <pre className="code-block__fallback" style={{ padding: "0.75rem 1.25rem" }}>
              <code style={{ color: "var(--accent)" }}>npm install @mdwebb/react-chess</code>
            </pre>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <CodeBlock code={quickStart} language="tsx" title="App.tsx" />
        </FadeIn>
      </section>

      {/* Features */}
      <section style={{ padding: "2.5rem 1.5rem", maxWidth: "64rem", margin: "0 auto" }}>
        <FadeIn style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <h2 className="section-title">Features</h2>
          <p className="section-subtitle">Everything you need for chess in React</p>
        </FadeIn>

        <Stagger
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "0.625rem",
          }}
        >
          {features.map(({ icon, title, desc }) => (
            <StaggerItem key={title}>
              <div className="card" style={{ padding: "1rem 1.25rem" }}>
                <div style={{ fontSize: "1.25rem", marginBottom: "0.375rem" }}>{icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: "0.125rem", fontSize: "0.875rem" }}>
                  {title}
                </h3>
                <p style={{ fontSize: "0.75rem", color: "var(--fg-secondary)", lineHeight: 1.5 }}>
                  {desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Demos */}
      <section style={{ padding: "2.5rem 1.5rem 3rem", maxWidth: "64rem", margin: "0 auto" }}>
        <FadeIn style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <h2 className="section-title">Interactive Demos</h2>
          <p className="section-subtitle">Explore every feature live</p>
        </FadeIn>

        <Stagger
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "0.625rem",
          }}
        >
          {demos.map((demo) => (
            <StaggerItem key={demo.href}>
              <a
                href={demo.href}
                className="card card--glow"
                style={{
                  display: "block",
                  padding: "1.25rem",
                  textDecoration: "none",
                  color: "var(--fg)",
                  height: "100%",
                }}
              >
                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{demo.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: "0.875rem", marginBottom: "0.125rem" }}>
                  {demo.title}
                  <span style={{ color: "var(--accent)", marginLeft: "0.375rem" }}>→</span>
                </h3>
                <p style={{ fontSize: "0.75rem", color: "var(--fg-secondary)" }}>{demo.desc}</p>
              </a>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </div>
  );
}
