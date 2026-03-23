import type { Metadata } from "next";
import "@mdwebb/react-chess/styles";
import "./globals.css";

export const metadata: Metadata = {
  title: "React Chess - Feature-Rich Chess Board Component",
  description:
    "A highly configurable React chess board component built with chessground and chess.js. Supports PGN, custom themes, compound components, and more.",
  icons: {
    icon: "/icon.svg",
  },
};

function Nav() {
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "1px solid var(--border)",
        padding: "0 1.5rem",
        height: "3.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(10, 10, 14, 0.8)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <a
        href="/"
        style={{
          fontWeight: 800,
          fontSize: "0.9375rem",
          color: "var(--fg)",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          letterSpacing: "-0.02em",
        }}
      >
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
        <span>React Chess</span>
      </a>
      <div
        style={{
          display: "flex",
          gap: "0.25rem",
          fontSize: "0.8125rem",
        }}
      >
        {[
          ["Basic", "/demos/basic"],
          ["PGN Viewer", "/demos/pgn-viewer"],
          ["Themes", "/demos/theme-customizer"],
          ["Compound", "/demos/compound"],
          ["Callbacks", "/demos/callbacks"],
        ].map(([label, href]) => (
          <a
            key={href}
            href={href}
            style={{
              padding: "0.375rem 0.75rem",
              borderRadius: "0.375rem",
              color: "var(--fg-secondary)",
              transition: "all 0.2s",
            }}
          >
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Nav />
        <main style={{ minHeight: "calc(100vh - 3.5rem)" }}>{children}</main>
        <footer
          style={{
            borderTop: "1px solid var(--border)",
            padding: "2rem 1.5rem",
            textAlign: "center",
            color: "var(--muted)",
            fontSize: "0.8125rem",
          }}
        >
          Built with chessground & chess.js
        </footer>
      </body>
    </html>
  );
}
