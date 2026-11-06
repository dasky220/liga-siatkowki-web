import Link from 'next/link';
import {
  fetchGuildMeta,
  fetchStandings,
  fetchTeams,
  fetchSchedule,
  fetchResults,
  splitTeamDisplay,
  formatDateShort,
  formatDayMonth,
  formatTime,
  GUILD_ID,
  DISCORD_INVITE,
  type StandingRow,
  type Team,
  type Match,
} from '@/lib/api';

export const revalidate = 30;

export default async function HomePage() {
  // Pobieramy dane równolegle (szybciej)
  const [metaRes, standingsRes, teamsRes, scheduleRes, resultsRes] = await Promise.allSettled([
    fetchGuildMeta(),
    fetchStandings(),
    fetchTeams(),
    fetchSchedule(GUILD_ID, 8),
    fetchResults(GUILD_ID, 6),
  ]);

  const meta = metaRes.status === 'fulfilled' ? metaRes.value : null;
  const standings: StandingRow[] =
    standingsRes.status === 'fulfilled' ? standingsRes.value.standings : [];
  const teams: Team[] = teamsRes.status === 'fulfilled' ? teamsRes.value.teams : [];
  const schedule: Match[] =
    scheduleRes.status === 'fulfilled' ? scheduleRes.value.matches : [];
  const results: Match[] =
    resultsRes.status === 'fulfilled' ? resultsRes.value.matches : [];

  const error =
    metaRes.status === 'rejected' ? (metaRes.reason as Error).message : null;

  const top3 = standings.slice(0, 3);
  const leader = top3[0];

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        {/* Banner tło */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/80 to-ink-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/40" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:py-24">
          <div className="flex flex-col items-start gap-6">
            {/* Logo + nazwa */}
            <div className="flex items-center gap-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.jpg"
                alt="Just Volleyball Polska"
                className="h-20 w-20 rounded-2xl ring-4 ring-flame-500/40 shadow-glow sm:h-24 sm:w-24"
              />
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.4em] text-flame-400">
                  Oficjalna strona ligi
                </div>
                <h1 className="mt-1 font-display text-4xl font-extrabold tracking-tight sm:text-6xl">
                  JUST <span className="text-flame-500">VOLLEYBALL</span>
                  <br />
                  <span className="bg-gradient-to-r from-red-500 via-red-400 to-white bg-clip-text text-transparent">
                    POLSKA
                  </span>
                </h1>
              </div>
            </div>

            {/* Subtitle */}
            <p className="max-w-2xl text-base text-slate-200 sm:text-lg">
              {meta?.active_season?.name
                ? `Sezon aktywny: ${meta.active_season.name}`
                : 'Liga siatkówki w Polsce'}
              {' · '}
              {teams.length} drużyn · {standings.length} w tabeli · odświeżanie co 30 s
            </p>

            {/* CTA */}
            <div className="flex flex-wrap gap-3">
              <a
                href={DISCORD_INVITE}
                target="_blank"
                rel="noreferrer"
                className="btn-primary bg-[#5865F2] hover:bg-[#4752c4]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.02.06.03.09.02c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.88-.95-1.88-2.12s.83-2.12 1.88-2.12c1.06 0 1.9.96 1.88 2.12c0 1.17-.83 2.12-1.88 2.12zm6.97 0c-1.03 0-1.88-.95-1.88-2.12s.83-2.12 1.88-2.12c1.06 0 1.9.96 1.88 2.12c0 1.17-.82 2.12-1.88 2.12z" />
                </svg>
                Dołącz na Discord
              </a>
              <a href="#tabela" className="btn-primary bg-ink-700 hover:bg-ink-600">
                Zobacz tabelę →
              </a>
            </div>

            {/* Błąd połączenia */}
            {error && (
              <div className="card border-flame-500/40 bg-flame-500/10 px-5 py-3 text-sm text-flame-300">
                ⚠️ Brak połączenia z API bota: {error}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== PODSUMOWANIE W LICZBACH ===== */}
      <section className="border-b border-ink-700/60 bg-ink-900/60">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px sm:grid-cols-4">
          <Stat label="Drużyn w lidze" value={teams.length} icon="🏐" />
          <Stat label="W tabeli" value={standings.length} icon="📊" />
          <Stat label="Nadchodzące mecze" value={schedule.length} icon="📅" />
          <Stat
            label="Lider"
            value={leader ? splitTeamDisplay(leader.team.name).name : '—'}
            icon="🏆"
          />
        </div>
      </section>

      {/* ===== GŁÓWNA SIATKA ===== */}
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Lewa: tabela (2/3 szerokości) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sekcja TABELA (kanał #tabela) */}
            <section id="tabela" className="card overflow-hidden">
              <SectionHeader
                icon="🏆"
                title="Tabela ligowa"
                channel="#tabela"
                subtitle={meta?.active_season?.name}
              />
              {standings.length === 0 ? (
                <EmptyState message="Brak rozegranych meczów w tym sezonie." />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-ink-700/60 text-xs uppercase tracking-wider text-slate-500">
                        <th className="py-3 pl-5 pr-2 text-left">#</th>
                        <th className="px-2 py-3 text-left">Drużyna</th>
                        <th className="px-2 py-3 text-center">M</th>
                        <th className="px-2 py-3 text-center">W</th>
                        <th className="px-2 py-3 text-center">P</th>
                        <th className="px-2 py-3 text-center">Sety</th>
                        <th className="px-2 py-3 pr-5 text-center font-bold text-flame-400">PKT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {standings.map((r) => {
                        const { name } = splitTeamDisplay(r.team.name);
                        return (
                          <tr
                            key={r.team.id}
                            className="border-t border-ink-700/40 transition hover:bg-ink-700/30"
                          >
                            <td className="py-3 pl-5 pr-2">
                              <PositionBadge pos={r.position} />
                            </td>
                            <td className="px-2 py-3">
                              <Link
                                href={`/druzyny/${r.team.id}`}
                                className="font-medium text-white hover:text-flame-400"
                              >
                                {name}
                              </Link>
                            </td>
                            <td className="px-2 py-3 text-center text-slate-400">{r.m}</td>
                            <td className="px-2 py-3 text-center font-semibold text-court-300">{r.w}</td>
                            <td className="px-2 py-3 text-center text-slate-500">{r.l}</td>
                            <td className="px-2 py-3 text-center font-mono text-slate-400">
                              {r.sf}:{r.sa}
                            </td>
                            <td className="px-2 py-3 pr-5 text-center font-display text-base font-bold text-flame-400">
                              {r.pts}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              <SectionFooter hint="PKT: 3:0/3:1 → 3:0 · 3:2 → 2:1 · Tie-break: zwycięstwa, stosunek setów" />
            </section>

            {/* Sekcja WYNIKI (kanał #wyniki) */}
            <section className="card overflow-hidden">
              <SectionHeader
                icon="✅"
                title="Ostatnie wyniki"
                channel="#wyniki"
                link="/wyniki"
                linkLabel="Wszystkie →"
              />
              {results.length === 0 ? (
                <EmptyState message="Brak zakończonych meczów." />
              ) : (
                <ul className="divide-y divide-ink-700/40">
                  {results.map((m) => (
                    <MatchRow key={m.id} match={m} finished />
                  ))}
                </ul>
              )}
            </section>
          </div>

          {/* Prawa kolumna: terminarz + top 3 */}
          <div className="space-y-6">
            {/* TOP 3 (medale) */}
            {top3.length > 0 && (
              <section className="card overflow-hidden">
                <SectionHeader icon="🥇" title="Podium" channel="#top" />
                <ul className="divide-y divide-ink-700/40">
                  {top3.map((r, idx) => {
                    const medals = ['🥇', '🥈', '🥉'];
                    const { name } = splitTeamDisplay(r.team.name);
                    return (
                      <li key={r.team.id}>
                        <Link
                          href={`/druzyny/${r.team.id}`}
                          className="flex items-center gap-3 px-5 py-3 hover:bg-ink-700/30"
                        >
                          <span className="text-2xl">{medals[idx]}</span>
                          <div className="flex-1">
                            <div className="font-medium text-white">{name}</div>
                            <div className="text-xs text-slate-500">
                              {r.w}W · {r.l}P · Sety {r.sf}:{r.sa}
                            </div>
                          </div>
                          <div className="font-display text-xl font-bold text-flame-400">
                            {r.pts}
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            {/* Sekcja TERMINARZ (kanał #terminarz) */}
            <section className="card overflow-hidden">
              <SectionHeader
                icon="📅"
                title="Nadchodzące mecze"
                channel="#terminarz"
                link="/terminarz"
                linkLabel="Wszystkie →"
              />
              {schedule.length === 0 ? (
                <EmptyState message="Brak zaplanowanych meczów." />
              ) : (
                <ul className="divide-y divide-ink-700/40">
                  {schedule.map((m) => (
                    <MatchRow key={m.id} match={m} finished={false} />
                  ))}
                </ul>
              )}
            </section>

            {/* DRUŻYNY (kanał #zespoły) */}
            <section className="card overflow-hidden">
              <SectionHeader
                icon="👕"
                title="Drużyny"
                channel="#zespoły"
                link="/druzyny"
                linkLabel="Wszystkie →"
              />
              {teams.length === 0 ? (
                <EmptyState message="Brak zarejestrowanych drużyn." />
              ) : (
                <ul className="grid grid-cols-1 gap-px sm:grid-cols-2">
                  {teams.slice(0, 8).map((t) => {
                    const { emoji, name } = splitTeamDisplay(t.name);
                    return (
                      <li key={t.id}>
                        <Link
                          href={`/druzyny/${t.id}`}
                          className="flex items-center gap-3 px-5 py-3 hover:bg-ink-700/30"
                        >
                          <span className="text-xl">{emoji || '🏐'}</span>
                          <span className="truncate text-sm font-medium text-white hover:text-flame-400">
                            {name}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Pomocnicze komponenty UI ---

function Stat({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className="bg-ink-900/60 px-5 py-5">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span>{icon}</span>
        <span className="uppercase tracking-wider">{label}</span>
      </div>
      <div className="mt-1 truncate font-display text-xl font-bold text-white">
        {value}
      </div>
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  channel,
  subtitle,
  link,
  linkLabel,
}: {
  icon: string;
  title: string;
  channel: string;
  subtitle?: string;
  link?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-ink-700/60 px-5 py-3">
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <div>
          <h2 className="font-display text-base font-bold leading-none">{title}</h2>
          <span className="text-[10px] font-mono uppercase tracking-wider text-flame-400/70">
            {channel}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {subtitle && <span className="text-xs text-slate-500">{subtitle}</span>}
        {link && (
          <Link href={link} className="text-xs text-flame-400 hover:text-flame-300">
            {linkLabel}
          </Link>
        )}
      </div>
    </div>
  );
}

function SectionFooter({ hint }: { hint: string }) {
  return (
    <div className="border-t border-ink-700/60 px-5 py-2 text-[11px] text-slate-500">{hint}</div>
  );
}

function EmptyState({ message }: { message: string }) {
  return <div className="px-5 py-10 text-center text-sm text-slate-500">{message}</div>;
}

function PositionBadge({ pos }: { pos: number }) {
  const cls =
    pos === 1
      ? 'bg-flame-500 text-white'
      : pos === 2
      ? 'bg-ink-600 text-flame-300'
      : pos === 3
      ? 'bg-ink-600 text-flame-400'
      : 'text-slate-400';
  return (
    <span
      className={`inline-flex h-7 w-7 items-center justify-center rounded-lg font-display text-sm font-bold ${cls}`}
    >
      {pos}
    </span>
  );
}

function MatchRow({ match, finished }: { match: Match; finished: boolean }) {
  const t1 = splitTeamDisplay(match.team1_name || 'Drużyna 1');
  const t2 = splitTeamDisplay(match.team2_name || 'Drużyna 2');
  return (
    <li className="px-5 py-3">
      <div className="flex items-center justify-between gap-3">
        <Link
          href={`/druzyny/${match.team1_id}`}
          className="flex flex-1 items-center gap-2 text-right justify-end hover:text-flame-400"
        >
          <span className="truncate text-sm font-medium text-white">{t1.name}</span>
          <span className="text-xl">{t1.emoji || '🏐'}</span>
        </Link>
        <div className="flex min-w-[70px] flex-col items-center">
          {finished ? (
            <span className="font-mono text-lg font-bold text-flame-400">
              {match.score1}:{match.score2}
            </span>
          ) : (
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              vs
            </span>
          )}
          <span className="mt-0.5 text-[10px] text-slate-500">
            {formatDayMonth(match.scheduled_at)} · {formatTime(match.scheduled_at)}
          </span>
        </div>
        <Link
          href={`/druzyny/${match.team2_id}`}
          className="flex flex-1 items-center gap-2 hover:text-flame-400"
        >
          <span className="text-xl">{t2.emoji || '🏐'}</span>
          <span className="truncate text-sm font-medium text-white">{t2.name}</span>
        </Link>
      </div>
    </li>
  );
}
