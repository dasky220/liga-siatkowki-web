import Link from 'next/link';
import {
  fetchResults,
  splitTeamDisplay,
  formatDayMonth,
  formatTime,
  type Match,
} from '@/lib/api';

export const revalidate = 30;

export default async function ResultsPage() {
  let results: Match[] = [];
  let error: string | null = null;

  try {
    const res = await fetchResults(undefined, 100);
    results = res.matches || [];
  } catch (e: any) {
    error = e?.message;
  }

  // Grupujemy po dacie
  const grouped = new Map<string, Match[]>();
  results.forEach((m) => {
    const key = m.scheduled_at ? formatDayMonth(m.scheduled_at) : 'Bez terminu';
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(m);
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Breadcrumb current="Wyniki" />
      <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight">
        ✅ Wyniki meczów
      </h1>
      <p className="mt-1 text-sm text-slate-400">
        Ostatnie zakończone mecze · {results.length} wyników
      </p>

      {error && (
        <div className="card mt-6 p-4 text-sm text-flame-400">⚠️ {error}</div>
      )}

      {results.length === 0 ? (
        <div className="card mt-8 p-10 text-center text-slate-500">
          <div className="text-5xl mb-3">🏐</div>
          <p>Brak rozegranych meczów.</p>
          <p className="mt-2 text-xs">
            Rozegraj mecz przez bota Discord, a wynik pojawi się tutaj automatycznie.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {Array.from(grouped.entries()).map(([day, matches]) => (
            <section key={day} className="card overflow-hidden">
              <div className="border-b border-ink-700/60 bg-ink-900/40 px-5 py-2">
                <h2 className="font-display text-sm font-bold uppercase tracking-wider text-flame-400">
                  {day}
                </h2>
              </div>
              <ul className="divide-y divide-ink-700/40">
                {matches.map((m) => (
                  <ResultRow key={m.id} match={m} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function ResultRow({ match }: { match: Match }) {
  const t1 = splitTeamDisplay(match.team1_name || 'Drużyna 1');
  const t2 = splitTeamDisplay(match.team2_name || 'Drużyna 2');
  const s1 = match.score1 ?? 0;
  const s2 = match.score2 ?? 0;
  const team1Won = s1 > s2;
  return (
    <li className="flex items-center gap-4 px-5 py-4 hover:bg-ink-700/30">
      <div className="w-20 text-center">
        <div className="font-mono text-xs text-slate-500">
          {formatTime(match.scheduled_at)}
        </div>
      </div>
      <div className="hidden h-10 w-px bg-ink-700 sm:block" />
      <Link
        href={`/druzyny/${match.team1_id}`}
        className={`flex flex-1 items-center gap-2 justify-end text-right hover:text-flame-400 ${
          team1Won ? 'font-bold text-white' : 'text-slate-400'
        }`}
      >
        <span className="truncate text-sm">{t1.name}</span>
        <span className="text-2xl">{t1.emoji || '🏐'}</span>
      </Link>
      <div className="rounded-lg bg-ink-900 px-4 py-1.5 font-mono text-lg font-bold text-flame-400">
        {s1}:{s2}
      </div>
      <Link
        href={`/druzyny/${match.team2_id}`}
        className={`flex flex-1 items-center gap-2 hover:text-flame-400 ${
          !team1Won ? 'font-bold text-white' : 'text-slate-400'
        }`}
      >
        <span className="text-2xl">{t2.emoji || '🏐'}</span>
        <span className="truncate text-sm">{t2.name}</span>
      </Link>
    </li>
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
