import type { Metadata } from "next";
import "@mdwebb/react-chess/styles";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "react-chess // feature-rich chess board for React",
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
    <html lang="en">
      <body>
        <Nav />
        <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
