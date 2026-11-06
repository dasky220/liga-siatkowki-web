import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  fetchTeam,
  fetchGuildMeta,
  splitTeamDisplay,
  formatDateShort,
} from '@/lib/api';

export const revalidate = 30;

interface PageProps {
  params: { guildId: string; teamId: string };
}

export default async function TeamPage({ params }: PageProps) {
  const gid = params.guildId;
  let teamId: number;
  try {
    teamId = parseInt(params.teamId, 10);
    if (isNaN(teamId)) notFound();
  } catch {
    notFound();
  }

  let meta: any = null;
  let team: any = null;
  let error: string | null = null;

  try {
    [meta, team] = await Promise.all([
      fetchGuildMeta(gid).catch(() => null),
      fetchTeam(gid, teamId),
    ]);
  } catch (e: any) {
    if (e?.message?.includes('404')) notFound();
    error = e?.message;
  }

  if (!team && !error) notFound();

  const { emoji, name } = splitTeamDisplay(team?.name || 'Drużyna');
  const recent = team?.recent_matches || [];
  const upcoming = team?.upcoming_matches || [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <nav className="mb-6 text-xs text-slate-500">
        <Link href="/" className="hover:text-flame-400">Ligi</Link>
        <span className="mx-1">/</span>
        <Link href={`/league/${gid}`} className="hover:text-flame-400">{meta?.name || gid}</Link>
        <span className="mx-1">/</span>
        <span className="text-slate-400">{name}</span>
      </nav>

      {/* Nagłówek drużyny */}
      <div className="card mb-6 flex items-center gap-5 p-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-ink-700 text-5xl">
          {emoji || '🏐'}
        </div>
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">{name}</h1>
          <p className="mt-1 text-sm text-slate-400">
            ID #{team?.id} · {team?.active ? (
              <span className="badge bg-court-500/15 text-court-300">Aktywna</span>
            ) : (
              <span className="badge bg-ink-700 text-slate-400">Nieaktywna</span>
            )}
          </p>
        </div>
      </div>

      {error && (
        <div className="card mb-6 p-4 text-sm text-flame-400">⚠️ {error}</div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Najnowsze mecze */}
        <section className="card overflow-hidden">
          <div className="border-b border-ink-700/60 px-5 py-3">
            <h2 className="font-display text-lg font-bold">✅ Ostatnie mecze</h2>
          </div>
          {recent.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-slate-500">Brak rozegranych meczów.</div>
          ) : (
            <ul className="divide-y divide-ink-700/40">
              {recent.map((m: any) => {
                const isTeam1 = m.team1_id === team.id;
                const ours = isTeam1 ? m.score1 : m.score2;
                const theirs = isTeam1 ? m.score2 : m.score1;
                const won = ours > theirs;
                const oppId = isTeam1 ? m.team2_id : m.team1_id;
                const oppName = isTeam1 ? m.team2_name : m.team1_name || `Drużyna ${oppId}`;
                return (
                  <li key={m.id} className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className={`badge ${won ? 'bg-court-500/15 text-court-300' : 'bg-ink-700 text-slate-400'}`}>
                        {won ? 'W' : 'P'}
                      </span>
                      <Link href={`/league/${gid}/team/${oppId}`} className="text-sm hover:text-flame-400">
                        vs {oppName}
                      </Link>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-flame-400">{ours}:{theirs}</span>
                      <span className="text-xs text-slate-500">{formatDateShort(m.scheduled_at)}</span>
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
            <div className="px-5 py-8 text-center text-sm text-slate-500">Brak zaplanowanych meczów.</div>
          ) : (
            <ul className="divide-y divide-ink-700/40">
              {upcoming.map((m: any) => {
                const isTeam1 = m.team1_id === team.id;
                const oppId = isTeam1 ? m.team2_id : m.team1_id;
                const oppName = isTeam1 ? '—' : '—';
                return (
                  <li key={m.id} className="flex items-center justify-between px-5 py-3">
                    <Link href={`/league/${gid}/team/${oppId}`} className="text-sm hover:text-flame-400">
                      {isTeam1 ? 'Dom' : 'Wyjazd'} vs Drużyna #{oppId}
                    </Link>
                    <span className="text-xs text-slate-500">{formatDateShort(m.scheduled_at)}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-6">
        <Link href={`/league/${gid}`} className="btn-primary">
          ← Wróć do tabeli ligowej
        </Link>
      </div>
    </div>
  );
}
