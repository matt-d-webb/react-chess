import type { Metadata } from "next";
import "@mdwebb/react-chess/styles";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "React Chess - Feature-Rich Chess Board Component",
  description:
    "A highly configurable React chess board component built with chessground and chess.js. Supports PGN, custom themes, compound components, and more.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Nav />
          <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>
          <footer className="border-t border-border px-6 py-8 text-center text-[0.8125rem] text-(--muted-text)">
            Built with chessground &amp; chess.js
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
