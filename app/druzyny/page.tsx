import Link from 'next/link';
import {
  fetchTeams,
  fetchStandings,
  splitTeamDisplay,
} from '@/lib/api';

export const revalidate = 30;

export default async function TeamsPage() {
  const [teamsRes, standingsRes] = await Promise.allSettled([
    fetchTeams(),
    fetchStandings(),
  ]);

  const teams = teamsRes.status === 'fulfilled' ? teamsRes.value.teams : [];
  const standings =
    standingsRes.status === 'fulfilled' ? standingsRes.value.standings : [];

  // Mapa pozycji w tabeli
  const positions = new Map<number, StandingRow>();
  standings.forEach((s) => positions.set(s.team.id, s));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Breadcrumb current="Drużyny" />
      <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight">
        👕 Drużyny ligi
      </h1>
      <p className="mt-1 text-sm text-slate-400">
        {teams.length} drużyn w lidze
      </p>

      {teams.length === 0 ? (
        <div className="card mt-6 p-10 text-center text-slate-500">
          <div className="text-5xl mb-3">🏐</div>
          <p>Brak zarejestrowanych drużyn. Załóż drużynę przez Discord!</p>
          <a
            href="https://discord.gg/32bwcEWCT2"
            target="_blank"
            rel="noreferrer"
            className="btn-primary mt-4"
          >
            Dołącz na Discord
          </a>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((t) => {
            const { emoji, name } = splitTeamDisplay(t.name);
            const pos = positions.get(t.id);
            return (
              <Link
                key={t.id}
                href={`/druzyny/${t.id}`}
                className="card card-hover group flex flex-col gap-3 p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-ink-700 text-3xl">
                    {emoji || '🏐'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-lg font-bold truncate">{name}</h3>
                    {pos && (
                      <div className="text-xs text-slate-500">
                        Pozycja #{pos.position} · {pos.w}W {pos.l}P · {pos.pts} PKT
                      </div>
                    )}
                  </div>
                  <span className="text-slate-600 transition group-hover:text-flame-400">→</span>
                </div>
                {pos && (
                  <div className="grid grid-cols-4 gap-2 border-t border-ink-700/60 pt-3 text-center">
                    <Stat label="M" value={pos.m} />
                    <Stat label="W" value={pos.w} accent="text-court-300" />
                    <Stat label="P" value={pos.l} />
                    <Stat label="PKT" value={pos.pts} accent="text-flame-400" />
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

import type { StandingRow } from '@/lib/api';

function Stat({ label, value, accent = '' }: { label: string; value: number; accent?: string }) {
  return (
    <div>
      <div className={`font-display text-lg font-bold ${accent || 'text-white'}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
    </div>
  );
}

function Breadcrumb({ current }: { current: string }) {
  return (
    <nav className="text-xs text-slate-500">
      <Link href="/" className="hover:text-flame-400">Strona główna</Link>
      <span className="mx-1">/</span>
      <span className="text-slate-400">{current}</span>
    </nav>
  );
}
