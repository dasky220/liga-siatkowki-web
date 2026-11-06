import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  fetchTeam,
  fetchGuildMeta,
  fetchStandings,
  splitTeamDisplay,
  formatDateShort,
  DISCORD_INVITE,
} from '@/lib/api';

export const revalidate = 30;

interface PageProps {
  params: { teamId: string };
}

export default async function TeamPage({ params }: PageProps) {
  let teamId: number;
  try {
    teamId = parseInt(params.teamId, 10);
    if (isNaN(teamId)) notFound();
  } catch {
    notFound();
  }

  const [metaRes, teamRes, standingsRes] = await Promise.allSettled([
    fetchGuildMeta(),
    fetchTeam(undefined, teamId),
    fetchStandings(),
  ]);

  if (teamRes.status === 'rejected') {
    if (teamRes.reason?.message?.includes('404')) notFound();
  }

  const meta = metaRes.status === 'fulfilled' ? metaRes.value : null;
  const team = teamRes.status === 'fulfilled' ? teamRes.value.team : null;
  const standings =
    standingsRes.status === 'fulfilled' ? standingsRes.value.standings : [];

  if (!team) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="card p-10">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="font-display text-2xl font-bold">Nie znaleziono drużyny</h1>
          <Link href="/druzyny" className="btn-primary mt-6">
            ← Wróć do listy drużyn
          </Link>
        </div>
      </div>
    );
  }

  const { emoji, name } = splitTeamDisplay(team.name);
  const recent = team.recent_matches || [];
  const upcoming = team.upcoming_matches || [];

  // Pozycja w tabeli
  const position = standings.findIndex((s) => s.team.id === team.id) + 1;
  const stats = standings.find((s) => s.team.id === team.id);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Breadcrumb current={name} />

      {/* Nagłówek drużyny — piękny banner */}
      <div className="card relative mt-2 overflow-hidden p-6 sm:p-8">
        <div className="absolute -right-12 -top-12 text-[180px] opacity-10">
          {emoji || '🏐'}
        </div>
        <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-ink-700 to-ink-900 text-6xl ring-2 ring-flame-500/40 shadow-glow">
            {emoji || '🏐'}
          </div>
          <div className="flex-1">
            <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              {name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-400">
              {team.active ? (
                <span className="badge bg-court-500/15 text-court-300">Aktywna</span>
              ) : (
                <span className="badge bg-ink-700 text-slate-400">Nieaktywna</span>
              )}
              {position > 0 && (
                <span className="badge bg-flame-500/15 text-flame-300">
                  Pozycja #{position} w tabeli
                </span>
              )}
            </div>
          </div>
          <a
            href={DISCORD_INVITE}
            target="_blank"
            rel="noreferrer"
            className="btn-primary bg-[#5865F2] hover:bg-[#4752c4]"
          >
            Discord →
          </a>
        </div>

        {/* Statystyki */}
        {stats && (
          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-ink-700/60 pt-5 sm:grid-cols-6">
            <StatBox label="Pozycja" value={`#${position}`} accent="text-flame-400" />
            <StatBox label="Mecze" value={stats.m} />
            <StatBox label="Wygrane" value={stats.w} accent="text-court-300" />
            <StatBox label="Porażki" value={stats.l} />
            <StatBox label="Sety" value={`${stats.sf}:${stats.sa}`} />
            <StatBox label="Punkty" value={stats.pts} accent="text-flame-400" />
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Najnowsze mecze */}
        <section className="card overflow-hidden">
          <div className="border-b border-ink-700/60 px-5 py-3">
            <h2 className="font-display text-lg font-bold">✅ Ostatnie mecze</h2>
          </div>
          {recent.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-slate-500">
              Brak rozegranych meczów.
            </div>
          ) : (
            <ul className="divide-y divide-ink-700/40">
              {recent.map((m) => {
                const isTeam1 = m.team1_id === team.id;
                const ours = isTeam1 ? m.score1 : m.score2;
                const theirs = isTeam1 ? m.score2 : m.score1;
                const won = (ours ?? 0) > (theirs ?? 0);
                const oppId = isTeam1 ? m.team2_id : m.team1_id;
                const oppName = isTeam1 ? m.team2_name : m.team1_name || `Drużyna ${oppId}`;
                return (
                  <li key={m.id} className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`badge ${
                          won
                            ? 'bg-court-500/15 text-court-300'
                            : 'bg-ink-700 text-slate-400'
                        }`}
                      >
                        {won ? 'W' : 'P'}
                      </span>
                      <Link
                        href={`/druzyny/${oppId}`}
                        className="text-sm hover:text-flame-400"
                      >
                        vs {splitTeamDisplay(oppName || '').name}
                      </Link>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-flame-400">
                        {ours}:{theirs}
                      </span>
                      <span className="text-xs text-slate-500">
                        {formatDateShort(m.scheduled_at)}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Nadchodzące mecze */}
        <section className="card overflow-hidden">
          <div className="border-b border-ink-700/60 px-5 py-3">
            <h2 className="font-display text-lg font-bold">📅 Nadchodzące mecze</h2>
          </div>
          {upcoming.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-slate-500">
              Brak zaplanowanych meczów.
            </div>
          ) : (
            <ul className="divide-y divide-ink-700/40">
              {upcoming.map((m) => {
                const isTeam1 = m.team1_id === team.id;
                const oppId = isTeam1 ? m.team2_id : m.team1_id;
                return (
                  <li
                    key={m.id}
                    className="flex items-center justify-between px-5 py-3"
                  >
                    <Link href={`/druzyny/${oppId}`} className="text-sm hover:text-flame-400">
                      {isTeam1 ? '🏠 Dom' : '✈️ Wyjazd'} vs #{oppId}
                    </Link>
                    <span className="text-xs text-slate-500">
                      {formatDateShort(m.scheduled_at)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-6">
        <Link href="/druzyny" className="btn-primary bg-ink-700 hover:bg-ink-600">
          ← Wszystkie drużyny
        </Link>
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  accent = 'text-white',
}: {
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <div className="text-center">
      <div className={`font-display text-xl font-bold ${accent}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
    </div>
  );
}

function Breadcrumb({ current }: { current: string }) {
  return (
    <nav className="text-xs text-slate-500">
      <Link href="/" className="hover:text-flame-400">Strona główna</Link>
      <span className="mx-1">/</span>
      <Link href="/druzyny" className="hover:text-flame-400">Drużyny</Link>
      <span className="mx-1">/</span>
      <span className="text-slate-400">{current}</span>
    </nav>
  );
}
