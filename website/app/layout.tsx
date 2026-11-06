import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Just Volleyball Polska',
  description:
    'Oficjalna strona ligi Just Volleyball Polska — tabele, terminarze, drużyny i wyniki na żywo.',
  openGraph: {
    title: 'Just Volleyball Polska',
    description:
      'Oficjalna strona ligi Just Volleyball Polska — tabele, terminarze, drużyny i wyniki na żywo.',
    type: 'website',
    images: ['/logo.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body className="font-sans antialiased">
        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Górny nagłówek z logo + Discord */}
          <header className="sticky top-0 z-30 border-b border-ink-700/60 bg-ink-950/90 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
              <a href="/" className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.jpg"
                  alt="Just Volleyball Polska"
                  className="h-11 w-11 rounded-full ring-2 ring-flame-500/40"
                />
                <div className="leading-none">
                  <div className="font-display text-lg font-extrabold tracking-tight">
                    JUST <span className="text-flame-500">VOLLEYBALL</span>
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-flame-400">
                    Polska
                  </div>
                </div>
              </a>
              <nav className="flex items-center gap-1 text-sm">
                <a
                  href="/"
                  className="hidden rounded-lg px-3 py-1.5 text-slate-300 hover:bg-ink-700 hover:text-white sm:block"
                >
                  Strona główna
                </a>
                <a
                  href="/druzyny"
                  className="hidden rounded-lg px-3 py-1.5 text-slate-300 hover:bg-ink-700 hover:text-white sm:block"
                >
                  Drużyny
                </a>
                <a
                  href="/terminarz"
                  className="hidden rounded-lg px-3 py-1.5 text-slate-300 hover:bg-ink-700 hover:text-white sm:block"
                >
                  Terminarz
                </a>
                <a
                  href="/wyniki"
                  className="hidden rounded-lg px-3 py-1.5 text-slate-300 hover:bg-ink-700 hover:text-white sm:block"
                >
                  Wyniki
                </a>
                <a
                  href="https://discord.gg/32bwcEWCT2"
                  target="_blank"
                  rel="noreferrer"
                  className="ml-2 inline-flex items-center gap-2 rounded-xl bg-[#5865F2] px-4 py-2 text-sm font-bold text-white shadow-glow transition hover:bg-[#4752c4] active:scale-95"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.02.06.03.09.02c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.88-.95-1.88-2.12s.83-2.12 1.88-2.12c1.06 0 1.9.96 1.88 2.12c0 1.17-.83 2.12-1.88 2.12zm6.97 0c-1.03 0-1.88-.95-1.88-2.12s.83-2.12 1.88-2.12c1.06 0 1.9.96 1.88 2.12c0 1.17-.82 2.12-1.88 2.12z" />
                  </svg>
                  Discord
                </a>
              </nav>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          {/* Footer */}
          <footer className="border-t border-ink-700/60 py-8">
            <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 sm:flex-row sm:justify-between">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.jpg"
                  alt=""
                  className="h-8 w-8 rounded-full ring-1 ring-ink-600"
                />
                <div className="text-xs text-slate-500">
                  © {new Date().getFullYear()} Just Volleyball Polska ·
                  dane live z bota Discord
                </div>
              </div>
              <a
                href="https://discord.gg/32bwcEWCT2"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#5865F2] hover:text-[#7983f5]"
              >
                discord.gg/32bwcEWCT2
              </a>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
