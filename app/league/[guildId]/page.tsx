import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  fetchGuildMeta,
  fetchStandings,
  fetchTeams,
  fetchSchedule,
  fetchResults,
  splitTeamDisplay,
  formatDateShort,
  type GuildMeta,
  type Season,
  type StandingRow,
  type Team,
  type Match,
} from '@/lib/api';

export const revalidate = 30;

interface PageProps {
  params: { guildId: string };
}

export default async function LeaguePage({ params }: PageProps) {
  const gid = params.guildId;
  let meta: (GuildMeta & { active_season: Season | null; seasons: Season[] }) | null = null;
  let standings: StandingRow[] = [];
  let teams: Team[] = [];
  let schedule: Match[] = [];
  let results: Match[] = [];
  let error: string | null = null;

  try {
    meta = await fetchGuildMeta(gid);
  } catch (e: any) {
    if (e?.message?.includes('404') || e?.message?.includes('No database')) {
      notFound();
    }
    error = e?.message || 'Błąd połączenia z API';
  }

  if (meta && !error) {
    try {
      const [s, t, sch, r] = await Promise.all([
        fetchStandings(gid),
        fetchTeams(gid),
        fetchSchedule(gid, 15),
        fetchResults(gid, 10),
      ]);
      standings = s.standings || [];
      teams = t.teams || [];
      schedule = sch.matches || [];
      results = r.matches || [];
    } catch (e: any) {
      error = e?.message;
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Nagłówek ligi */}
      <div className="mb-8 flex items-center gap-4">
        {meta?.icon_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={meta.icon_url}
            alt=""
            className="h-16 w-16 rounded-2xl object-cover ring-1 ring-ink-600"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ink-700 text-3xl">
            🏐
          </div>
        )}
        <div>
          <nav className="text-xs text-slate-500">
            <Link href="/" className="hover:text-flame-400">Ligi</Link>
            <span className="mx-1">/</span>
            <span className="text-slate-400">{meta?.name}</span>
          </nav>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">
            {meta?.name || 'Liga'}
          </h1>
          <p className="text-sm text-slate-400">
            {meta?.active_season?.name || 'Brak aktywnego sezonu'} · {teams.length} drużyn · {standings.length > 0 ? `${standings[0].m * 0 + 'meczów'}` : ''}
          </p>
        </div>
      </div>

      {error && (
        <div className="card mb-6 p-4 text-sm text-flame-400">
          ⚠️ {error}
        </div>
      )}

      {/* Layout: 2 kolumny na desktopie */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Lewa kolumna: tabela + terminarz */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabela */}
          <section className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-ink-700/60 px-5 py-3">
              <h2 className="font-display text-lg font-bold">🏆 Tabela ligowa</h2>
              <span className="label-muted">{meta?.active_season?.name}</span>
            </div>
            {standings.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-slate-500">
                Brak rozegranych meczów w tym sezonie.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs uppercase tracking-wider text-slate-500">
                      <th className="py-2 pl-5 pr-2 text-left">#</th>
                      <th className="px-2 py-2 text-left">Drużyna</th>
                      <th className="px-2 py-2 text-center">M</th>
                      <th className="px-2 py-2 text-center">W</th>
                      <th className="px-2 py-2 text-center">P</th>
                      <th className="px-2 py-2 text-center">Sety</th>
                      <th className="px-2 py-2 text-center font-bold text-flame-400">PKT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((r) => {
                      const { name } = splitTeamDisplay(r.team.name);
                      return (
                        <tr
                          key={r.team.id}
                          className="border-t border-ink-700/40 hover:bg-ink-700/30"
                        >
                          <td className="py-2.5 pl-5 pr-2">
                            <span className="font-mono font-bold text-slate-400">
                              {r.position <= 3 && r.position <= 3 ? (
                                <span className="text-flame-400">{r.position}</span>
                              ) : (
                                r.position
                              )}
                            </span>
                          </td>
                          <td className="px-2 py-2.5">
                            <Link
                              href={`/league/${gid}/team/${r.team.id}`}
                              className="font-medium text-white hover:text-flame-400"
                            >
                              {name}
                            </Link>
                          </td>
                          <td className="px-2 py-2.5 text-center text-slate-400">{r.m}</td>
                          <td className="px-2 py-2.5 text-center text-court-300">{r.w}</td>
                          <td className="px-2 py-2.5 text-center text-slate-500">{r.l}</td>
                          <td className="px-2 py-2.5 text-center text-slate-400 font-mono">
                            {r.sf}:{r.sa}
                          </td>
                          <td className="px-2 py-2.5 text-center font-bold text-flame-400">
                            {r.pts}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            <div className="border-t border-ink-700/60 px-5 py-2 text-xs text-slate-500">
              PKT: 3:0 / 3:1 → 3:0 · 3:2 → 2:1 · Tie-break: zwycięstwa, stosunek setów
            </div>
          </section>

          {/* Najnowsze wyniki */}
          <section className="card overflow-hidden">
            <div className="border-b border-ink-700/60 px-5 py-3">
              <h2 className="font-display text-lg font-bold">✅ Ostatnie wyniki</h2>
            </div>
            {results.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-slate-500">
                Brak zakończonych meczów.
              </div>
            ) : (
              <ul className="divide-y divide-ink-700/40">
                {results.map((m) => (
                  <MatchRow key={m.id} match={m} gid={gid} finished />
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Prawa kolumna: terminarz + drużyny */}
        <div className="space-y-6">
          {/* Nadchodzące mecze */}
          <section className="card overflow-hidden">
            <div className="border-b border-ink-700/60 px-5 py-3">
              <h2 className="font-display text-lg font-bold">📅 Nadchodzące mecze</h2>
            </div>
            {schedule.length === 0 ? (
              <div className="px-5 py-6 text-center text-sm text-slate-500">
                Brak zaplanowanych meczów.
              </div>
            ) : (
              <ul className="divide-y divide-ink-700/40">
                {schedule.map((m) => (
                  <MatchRow key={m.id} match={m} gid={gid} finished={false} />
                ))}
              </ul>
            )}
          </section>

          {/* Lista drużyn */}
          <section className="card overflow-hidden">
            <div className="border-b border-ink-700/60 px-5 py-3">
              <h2 className="font-display text-lg font-bold">👕 Drużyny</h2>
            </div>
            {teams.length === 0 ? (
              <div className="px-5 py-6 text-center text-sm text-slate-500">
                Brak zarejestrowanych drużyn.
              </div>
            ) : (
              <ul className="divide-y divide-ink-700/40">
                {teams.map((t) => {
                  const { emoji, name } = splitTeamDisplay(t.name);
                  return (
                    <li key={t.id}>
                      <Link
                        href={`/league/${gid}/team/${t.id}`}
                        className="flex items-center gap-3 px-5 py-2.5 hover:bg-ink-700/30"
                      >
                        <span className="text-xl">{emoji || '🏐'}</span>
                        <span className="font-medium text-white hover:text-flame-400">{name}</span>
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
  );
}

function MatchRow({ match, gid, finished }: { match: Match; gid: string; finished: boolean }) {
  const t1 = splitTeamDisplay(match.team1_name || 'Drużyna 1');
  const t2 = splitTeamDisplay(match.team2_name || 'Drużyna 2');
  return (
    <li className="px-5 py-3">
      <div className="flex items-center justify-between gap-3">
        <Link
          href={`/league/${gid}/team/${match.team1_id}`}
          className="flex flex-1 items-center gap-2 text-right justify-end hover:text-flame-400"
        >
          <span className="truncate text-sm font-medium text-white">{t1.name}</span>
          <span className="text-lg">{t1.emoji || '🏐'}</span>
        </Link>
        <div className="flex min-w-[60px] flex-col items-center">
          {finished ? (
            <span className="font-mono text-base font-bold text-flame-400">
              {match.score1}:{match.score2}
            </span>
          ) : (
            <span className="text-xs text-slate-500">vs</span>
          )}
          <span className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-500">
            {formatDateShort(match.scheduled_at)}
          </span>
        </div>
        <Link
          href={`/league/${gid}/team/${match.team2_id}`}
          className="flex flex-1 items-center gap-2 hover:text-flame-400"
        >
          <span className="text-lg">{t2.emoji || '🏐'}</span>
          <span className="truncate text-sm font-medium text-white">{t2.name}</span>
        </Link>
      </div>
    </li>
  );
}
