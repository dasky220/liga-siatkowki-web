import { fetchGuilds, type GuildMeta } from '@/lib/api';

export const revalidate = 60; // ISR: lista gildii odświeżana co minutę

export default async function HomePage() {
  let guilds: GuildMeta[] = [];
  let error: string | null = null;

  try {
    const data = await fetchGuilds();
    guilds = data.guilds || [];
  } catch (e: any) {
    error = e?.message || 'Nie udało się połączyć z API bota';
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Hero */}
      <section className="mb-12 text-center">
        <span className="badge bg-flame-500/15 text-flame-400">
          🏐 Sezon 2025/26 — LIVE
        </span>
        <h1 className="mt-4 font-display text-5xl font-extrabold tracking-tight md:text-6xl">
          Twoja liga siatkówki
          <br />
          <span className="bg-gradient-to-r from-flame-400 to-flame-600 bg-clip-text text-transparent">
            w jednym miejscu
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-400">
          Tabele, terminarze, drużyny i wyniki — zsynchronizowane na żywo z
          botem Discord. Wybierz ligę, aby zobaczyć szczegóły.
        </p>
      </section>

      {/* Lista lig */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">Dostępne ligi</h2>
          <span className="label-muted">{guilds.length} serwerów</span>
        </div>

        {error ? (
          <div className="card p-8 text-center">
            <div className="text-flame-400 text-4xl mb-3">⚠️</div>
            <h3 className="font-display text-xl font-bold">Brak połączenia z botem</h3>
            <p className="mt-2 text-slate-400 text-sm">{error}</p>
            <p className="mt-4 text-xs text-slate-500">
              Upewnij się, że bot działa, a API jest dostępne pod adresem zdefiniowanym w
              <code className="mx-1 rounded bg-ink-700 px-1.5 py-0.5">NEXT_PUBLIC_API_URL</code>.
            </p>
          </div>
        ) : guilds.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="text-4xl mb-3">🏐</div>
            <h3 className="font-display text-xl font-bold">Brak lig</h3>
            <p className="mt-2 text-slate-400 text-sm">
              Bot jeszcze nie obsługuje żadnego serwera Discord. Dodaj bota na serwer i uruchom
              <code className="mx-1 rounded bg-ink-700 px-1.5 py-0.5">/setup</code>.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {guilds.map((g) => (
              <a
                key={g.id}
                href={`/league/${g.id}`}
                className="card card-hover group flex flex-col gap-3 p-5"
              >
                <div className="flex items-center gap-3">
                  {g.icon_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={g.icon_url}
                      alt=""
                      className="h-12 w-12 rounded-xl object-cover ring-1 ring-ink-600"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink-700 text-xl">
                      🏐
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-lg font-bold truncate">
                      {g.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {g.active_season || 'Brak aktywnego sezonu'}
                    </p>
                  </div>
                  <span className="text-slate-600 transition group-hover:text-flame-400">→</span>
                </div>
                <div className="flex items-center justify-between border-t border-ink-700/60 pt-3 text-sm">
                  <span className="text-slate-400">
                    {g.teams_count ?? 0}{' '}
                    <span className="text-xs">drużyn</span>
                  </span>
                  <span className="badge bg-court-500/15 text-court-300">
                    Zobacz ligę →
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* Sekcje informacyjne */}
      <section className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Feature
          icon="📊"
          title="Tabela na żywo"
          desc="Pozycje, mecze, stosunek setów i punkty — dokładnie jak w bocie, odświeżane automatycznie."
        />
        <Feature
          icon="📅"
          title="Terminarz meczów"
          desc="Nadchodzące mecze i wyniki zakończonych spotkań z dokładnymi datami i godzinami."
        />
        <Feature
          icon="🏆"
          title="Karty drużyn"
          desc="Każda drużyna ma własną stronę z ostatnimi wynikami i nadchodzącymi spotkaniami."
        />
      </section>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="card p-6">
      <div className="text-3xl">{icon}</div>
      <h3 className="mt-3 font-display text-lg font-bold">{title}</h3>
      <p className="mt-1 text-sm text-slate-400">{desc}</p>
    </div>
  );
}
