export function Footer() {
  return (
    <footer className="relative mt-16 border-t border-border bg-(--bg-secondary)">
      <div className="bg-grid mask-fade-y mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 text-[0.7rem] tracking-[0.16em] uppercase">
          <span className="pulse-dot pulse-dot-success" aria-hidden />
          <span className="text-(--fg-secondary)">
            system_status <span className="text-(--success)">// online</span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[0.65rem] tracking-[0.18em] uppercase text-(--muted-text)">
          <span>built_on // chessground &amp; chess.js</span>
          <span className="hidden sm:inline">·</span>
          <a
            href="https://github.com/matt-d-webb/react-chess"
            className="text-(--fg-secondary) hover:text-(--accent-site)"
          >
            github
          </a>
          <span className="hidden sm:inline">·</span>
          <a
            href="https://www.npmjs.com/package/@mdwebb/react-chess"
            className="text-(--fg-secondary) hover:text-(--accent-site)"
          >
            npm
          </a>
        </div>
      </div>
    </footer>
  );
}
