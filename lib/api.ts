/**
 * Klient API — proste wrapper'y fetch na endpointy bot_api.py.
 *
 * Wszystkie wywołania idą przez zmienną NEXT_PUBLIC_API_URL (publiczny URL API bota,
 * np. https://liga-twoj-bot.trycloudflare.com). Token autoryzacji jest READ-ONLY
 * i może być publiczny — udostępnia jedynie dane ligowe.
 */

export const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
export const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN || '';

if (!API_URL) {
  console.warn(
    '⚠️  NEXT_PUBLIC_API_URL nie jest ustawione. Strona nie połączy się z botem.'
  );
}

async function apiGet<T>(path: string, revalidate: number = 30): Promise<T> {
  if (!API_URL) {
    return { error: 'API_URL not configured' } as unknown as T;
  }
  const url = `${API_URL.replace(/\/$/, '')}${path}`;
  const headers: Record<string, string> = {};
  if (API_TOKEN) headers.Authorization = `Bearer ${API_TOKEN}`;

  const res = await fetch(url, {
    headers,
    next: { revalidate }, // ISR: odświeża stronę co N sekund
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${txt.slice(0, 200)}`);
  }
  return res.json() as Promise<T>;
}

// --- Typy --------------------------------------------------------------------

export interface GuildMeta {
  id: string;
  name: string;
  icon_url: string | null;
  teams_count?: number;
  active_season?: string;
}

export interface Season {
  id: number;
  name: string;
  active: number;
  double_round: number;
  created_at: string;
}

export interface Team {
  id: number;
  name: string;
  role_id: number | null;
  active: number;
  logo_url: string | null;
  owner_user_id: number | null;
}

export interface StandingRow {
  position: number;
  team: Team;
  m: number;
  w: number;
  l: number;
  pts: number;
  sf: number; // sety za
  sa: number; // sety przeciw
}

export interface Match {
  id: number;
  season_id: number;
  round_id: number | null;
  team1_id: number;
  team2_id: number;
  team1_name?: string;
  team2_name?: string;
  team1_logo?: string | null;
  team2_logo?: string | null;
  score1: number | null;
  score2: number | null;
  finished: number;
  walkover: number;
  scheduled_at: string | null;
}

// --- Funkcje -----------------------------------------------------------------

export const fetchGuilds = () => apiGet<{ guilds: GuildMeta[] }>('/api/guilds', 60);

export const fetchGuildMeta = (gid: string) =>
  apiGet<GuildMeta & { active_season: Season | null; seasons: Season[] }>(
    `/api/${gid}/meta`,
    60
  );

export const fetchStandings = (gid: string, seasonId?: number) =>
  apiGet<{ standings: StandingRow[]; season_id: number }>(
    `/api/${gid}/standings${seasonId ? `/${seasonId}` : ''}`,
    30
  );

export const fetchTeams = (gid: string) =>
  apiGet<{ teams: Team[] }>(`/api/${gid}/teams`, 60);

export const fetchTeam = (gid: string, teamId: number) =>
  apiGet<{ team: Team & { recent_matches: Match[]; upcoming_matches: Match[] } }>(
    `/api/${gid}/teams/${teamId}`,
    30
  );

export const fetchSchedule = (gid: string, limit = 30) =>
  apiGet<{ matches: Match[] }>(`/api/${gid}/schedule?limit=${limit}`, 30);

export const fetchResults = (gid: string, limit = 50) =>
  apiGet<{ matches: Match[] }>(`/api/${gid}/results?limit=${limit}`, 30);

// --- Pomocnicze --------------------------------------------------------------

/** Rozdziela "🏐 OGNIWO Warszawa" -> { emoji, name } */
export function splitTeamDisplay(name: string): { emoji: string | null; name: string } {
  const m = name.match(/^(\S+)\s+(.+)$/);
  if (m && /\p{Extended_Pictographic}/u.test(m[1])) {
    return { emoji: m[1], name: m[2] };
  }
  return { emoji: null, name };
}

/** Formatuje datę w formacie polskim */
export function formatDate(iso: string | null): string {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export function formatDateShort(iso: string | null): string {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}
