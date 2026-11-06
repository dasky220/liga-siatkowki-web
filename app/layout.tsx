import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Liga Siatkówki',
  description: 'Tabele, terminarze, drużyny i wyniki Twojej ligi siatkarskiej.',
  openGraph: {
    title: 'Liga Siatkówki',
    description: 'Tabele, terminarze, drużyny i wyniki Twojej ligi siatkarskiej.',
    type: 'website',
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
          <header className="sticky top-0 z-30 border-b border-ink-700/60 bg-ink-950/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
              <a href="/" className="flex items-center gap-2.5">
                <span className="text-2xl">🏐</span>
                <span className="font-display text-lg font-bold tracking-tight">
                  Liga<span className="text-flame-500">Siatkowki</span>
                </span>
              </a>
              <nav className="flex items-center gap-1 text-sm">
                <a
                  href="/"
                  className="rounded-lg px-3 py-1.5 text-slate-300 hover:bg-ink-700 hover:text-white"
                >
                  Ligi
                </a>
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg px-3 py-1.5 text-slate-300 hover:bg-ink-700 hover:text-white"
                >
                  Discord
                </a>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-ink-700/60 py-6 text-center text-xs text-slate-500">
            Dane pobierane na żywo z bota Discord · odświeżanie co 30 s
          </footer>
        </div>
      </body>
    </html>
  );
}
