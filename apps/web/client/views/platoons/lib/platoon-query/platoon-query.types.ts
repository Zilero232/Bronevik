import type { PLATOON_MODES, PLATOON_VOICE } from '../../config';

export type PlatoonMode = (typeof PLATOON_MODES)[number];

export type PlatoonVoiceFilter = (typeof PLATOON_VOICE)[number];

export type PlatoonFilters = {
  tier: number | null;
  mode: string | null;
  voice: PlatoonVoiceFilter;
  minWn8: number | null;
  maxWn8: number | null;
  at: string | null;
};
