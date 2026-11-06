/**
 * Klient API — proste wrapper'y fetch na endpointy bot_api.py.
 *
 * Strona jest przypisana do JEDNEJ gildii (Just Volleyball Polska).
 * ID gildii można zmienić przez NEXT_PUBLIC_GUILD_ID w .env, ale domyślnie
 * używamy gildii just volleyball Polska.
 */

export const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
export const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN || '';

/** Gildia, którą strona wyświetla (hardcoded do Just Volleyball Polska). */
export const GUILD_ID =
  process.env.NEXT_PUBLIC_GUILD_ID || '1567132715550249020';

/** Discord invite — przycisk w nagłówku. */
export const DISCORD_INVITE = 'https://discord.gg/32bwcEWCT2';

if (!API_URL) {
  console.warn('⚠️  NEXT_PUBLIC_API_URL nie jest ustawione.');
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
    next: { revalidate },
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${txt.slice(0, 200)}`);
  }
  return res.json() as Promise<T>;
}

// --- Typy --------------------------------------------------------------------

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

export const fetchGuildMeta = (gid: string = GUILD_ID) =>
  apiGet<{
    name: string;
    icon_url: string | null;
    active_season: Season | null;
    seasons: Season[];
  }>(`/api/${gid}/meta`, 60);

export const fetchStandings = (gid: string = GUILD_ID, seasonId?: number) =>
  apiGet<{ standings: StandingRow[]; season_id: number }>(
    `/api/${gid}/standings${seasonId ? `/${seasonId}` : ''}`,
    30
  );

export const fetchTeams = (gid: string = GUILD_ID) =>
  apiGet<{ teams: Team[] }>(`/api/${gid}/teams`, 60);

export const fetchTeam = (gid: string = GUILD_ID, teamId: number) =>
  apiGet<{ team: Team & { recent_matches: Match[]; upcoming_matches: Match[] } }>(
    `/api/${gid}/teams/${teamId}`,
    30
  );

export const fetchSchedule = (gid: string = GUILD_ID, limit = 30) =>
  apiGet<{ matches: Match[] }>(`/api/${gid}/schedule?limit=${limit}`, 30);

export const fetchResults = (gid: string = GUILD_ID, limit = 50) =>
  apiGet<{ matches: Match[] }>(`/api/${gid}/results?limit=${limit}`, 30);

// --- Pomocnicze --------------------------------------------------------------

export function splitTeamDisplay(name: string): { emoji: string | null; name: string } {
  const m = name.match(/^(\S+)\s+(.+)$/);
  if (m && /\p{Extended_Pictographic}/u.test(m[1])) {
    return { emoji: m[1], name: m[2] };
  }
  return { emoji: null, name };
}

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

export function formatDayMonth(iso: string | null): string {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleString('pl-PL', {
      day: '2-digit',
      month: 'long',
    });
  } catch {
    return iso;
  }
}

export function formatTime(iso: string | null): string {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleString('pl-PL', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}
