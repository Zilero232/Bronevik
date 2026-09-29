import path from 'node:path';

export const SCREENS_ENV = {
  baseUrl: (process.env.E2E_BASE_URL ?? 'http://localhost:3000').replace(/\/$/, ''),
  apiUrl: (process.env.E2E_API_URL ?? 'http://localhost:4000').replace(/\/$/, ''),
  authState: process.env.E2E_AUTH_STATE ?? ''
} as const;

const ROOT = path.resolve(import.meta.dirname, '..', '..', '..');
const OUT = path.join(ROOT, 'e2e', '.screens');

export const SCREENS_PATHS = {
  appDir: path.join(ROOT, 'apps', 'web', 'client', 'app', '[locale]'),
  out: OUT,
  raw: path.join(OUT, '.raw'),
  params: path.join(OUT, 'params.json'),
  auth: path.join(OUT, 'auth.json'),
  report: path.join(OUT, 'report.json')
} as const;

/** Route groups under `app/[locale]` the tour walks. */
export const SCREENS_GROUPS = ['(site)', '(overlay)', '(tma)'] as const;

/** Russian is the default locale and carries no prefix; these patterns also get an `/en` pass. */
export const SCREENS_EN_PATTERNS = ['/', '/tanks', '/t/[slug]', '/p/[nick]', '/c/[tag]', '/maps/[id]', '/streamers', '/me'] as const;

/** Pages that only make sense signed in — they get a second, signed-in pass. */
export const SCREENS_AUTH_PATTERN = /^\/me(?:\/|$)|\/new$|\/edit$|\/claim$/;

/**
 * A dynamic segment is resolved by `<parent segment>/<[param]>` — the same `[slug]`
 * means a tank under `/t` and a streamer under `/s`. Unknown pairs leave the route skipped.
 */
export const SCREENS_PARAM_KEYS: Record<string, keyof ScreenParams> = {
  't/[slug]': 'tankSlug',
  'builds/[tank]': 'tankSlug',
  'p/[nick]': 'playerNick',
  'sessions/[sessionId]': 'sessionId',
  'c/[tag]': 'clanTag',
  'maps/[id]': 'mapId',
  'missions/[campaign]': 'missionCampaign',
  '[campaign]/[operation]': 'missionOperation',
  'modes/[mode]': 'mode',
  's/[slug]': 'streamerSlug',
  'replays/[id]': 'replayId',
  'guides/[slug]': 'guideSlug',
  'tournaments/[slug]': 'tournamentSlug',
  'competitions/[slug]': 'competitionSlug',
  'coaching/[id]': 'coachId',
  'tactics/[id]': 'tacticsId',
  'battles/[id]': 'battleId',
  'overlay/[publicId]': 'overlayId'
};

export type ScreenParams = {
  tankSlug?: string;
  playerNick?: string;
  playerId?: string;
  sessionId?: string;
  clanTag?: string;
  mapId?: string;
  missionCampaign?: string;
  missionOperation?: string;
  mode?: string;
  streamerSlug?: string;
  replayId?: string;
  guideSlug?: string;
  tournamentSlug?: string;
  competitionSlug?: string;
  coachId?: string;
  tacticsId?: string;
  battleId?: string;
  overlayId?: string;
};

/** Failures that are the page working as designed, not bugs. */
export const SCREENS_EXPECTED_FAILURES: readonly { status: number; url: RegExp }[] = [
  // Anonymous probes of the signed-in endpoints.
  { status: 401, url: /\/me(?:\/|\?|$)/ },
  { status: 401, url: /\/auth\/get-session/ },
  // Tanks without a 3D armor model answer 404 by design; the page shows an empty state.
  { status: 404, url: /\/armor(?:\?|$)/ }
];

export const SCREENS_TIMING = {
  networkIdleMs: 15_000,
  apiTimeoutMs: 15_000,
  lazyScrollStepPx: 800,
  lazyScrollMaxSteps: 40,
  maxOffenders: 25
} as const;

export const SCREENS_FREEZE_CSS = `*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}
nextjs-portal{display:none!important}`;
