import Link from 'next/link';
import {
  fetchSchedule,
  splitTeamDisplay,
  formatDate,
  formatDayMonth,
  formatTime,
  type Match,
} from '@/lib/api';

export const revalidate = 30;

export default async function SchedulePage() {
  let schedule: Match[] = [];
  let error: string | null = null;

  try {
    const res = await fetchSchedule(undefined, 100);
    schedule = res.matches || [];
  } catch (e: any) {
    error = e?.message;
  }

  // Grupujemy mecze po dacie (dzień-miesiąc)
  const grouped = new Map<string, Match[]>();
  schedule.forEach((m) => {
    const key = m.scheduled_at ? formatDayMonth(m.scheduled_at) : 'Bez terminu';
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(m);
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Breadcrumb current="Terminarz" />
      <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight">
        📅 Terminarz meczów
      </h1>
      <p className="mt-1 text-sm text-slate-400">
        Nadchodzące mecze · {schedule.length} zaplanowanych
      </p>

      {error && (
        <div className="card mt-6 p-4 text-sm text-flame-400">⚠️ {error}</div>
      )}

      {schedule.length === 0 ? (
        <div className="card mt-8 p-10 text-center text-slate-500">
          <div className="text-5xl mb-3">📭</div>
          <p>Brak zaplanowanych meczów.</p>
          <p className="mt-2 text-xs">
            Sprawdź później lub dołącz na Discord, żeby dowiedzieć się więcej.
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
                  <ScheduleRow key={m.id} match={m} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function ScheduleRow({ match }: { match: Match }) {
  const t1 = splitTeamDisplay(match.team1_name || 'Drużyna 1');
  const t2 = splitTeamDisplay(match.team2_name || 'Drużyna 2');
  return (
    <li className="flex items-center gap-4 px-5 py-4 hover:bg-ink-700/30">
      {/* Godzina */}
      <div className="w-20 text-center">
        <div className="font-display text-lg font-bold text-flame-400">
          {formatTime(match.scheduled_at)}
        </div>
      </div>
      <div className="hidden h-10 w-px bg-ink-700 sm:block" />
      {/* Drużyna 1 */}
      <Link
        href={`/druzyny/${match.team1_id}`}
        className="flex flex-1 items-center gap-2 justify-end text-right hover:text-flame-400"
      >
        <span className="truncate text-sm font-semibold text-white">{t1.name}</span>
        <span className="text-2xl">{t1.emoji || '🏐'}</span>
      </Link>
      <div className="px-2 text-xs font-bold uppercase text-slate-600">vs</div>
      {/* Drużyna 2 */}
      <Link
        href={`/druzyny/${match.team2_id}`}
        className="flex flex-1 items-center gap-2 hover:text-flame-400"
      >
        <span className="text-2xl">{t2.emoji || '🏐'}</span>
        <span className="truncate text-sm font-semibold text-white">{t2.name}</span>
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
