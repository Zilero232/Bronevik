import type { PlatoonListQuery } from '../../api';

import { zonedInputToIso } from '@/shared/lib';

import type { NextSingleTierInput, PlatoonFilters, PlatoonMode } from './platoon-query.types';

import { PLATOON_MODES } from '../../config';

export const toPlatoonQuery = ({ tier, mode, voice, minWn8, maxWn8, at }: PlatoonFilters): PlatoonListQuery => {
  const availableAt = zonedInputToIso({ value: at });

  return {
    ...(tier === null ? {} : { tier }),
    ...(mode ? { mode } : {}),
    ...(voice === 'any' ? {} : { hasVoice: voice === 'yes' ? 'true' : 'false' }),
    ...(minWn8 === null ? {} : { minWn8 }),
    ...(maxWn8 === null ? {} : { maxWn8 }),
    ...(availableAt ? { availableAt } : {})
  };
};

export const hasActiveFilters = ({ tier, mode, voice, minWn8, maxWn8, at }: PlatoonFilters): boolean =>
  tier !== null || Boolean(mode) || voice !== 'any' || minWn8 !== null || maxWn8 !== null || Boolean(at);

export const toWn8Bound = (value: string): number | null => {
  const trimmed = value.trim();
  const parsed = Number(trimmed);

  return trimmed === '' || !Number.isInteger(parsed) || parsed < 0 ? null : parsed;
};

export const nextSingleTier = ({ next, current }: NextSingleTierInput): number | null => {
  const picked = next.find((value) => value !== (current === null ? null : String(current)));

  return picked === undefined ? null : Number(picked);
};

const KNOWN_MODES: ReadonlySet<string> = new Set(PLATOON_MODES);

export const isPlatoonMode = (mode: string): mode is PlatoonMode => KNOWN_MODES.has(mode);
