'use client';

import { toRoman } from '@otmetki/icons';
import { useFormatter, useTranslations } from 'next-intl';
import { useQueryStates } from 'nuqs';

import type { ActiveFilter } from '@/ui-kit';

import { zonedInputToIso } from '@/shared/lib';

import type { PlatoonFilters, PlatoonVoiceFilter } from '../../../lib/platoon-query';

import { PLATOON_BOARD, PLATOON_FILTER_PARSERS, PLATOON_MODES, PLATOON_TIME_FORMAT } from '../../../config';
import { hasActiveFilters, isPlatoonMode, toWn8Bound } from '../../../lib/platoon-query';

export const usePlatoonFilters = () => {
  const t = useTranslations('platoons.filters');
  const tModes = useTranslations('platoons.modes');
  const tFilters = useTranslations('common.filters');
  const tCommon = useTranslations('common');
  const format = useFormatter();
  const [filters, setFilters] = useQueryStates(PLATOON_FILTER_PARSERS, { history: 'replace' });

  const current: PlatoonFilters = filters;
  const wn8 = tCommon('ratings.wn8');
  const availableAt = zonedInputToIso({ value: current.at });

  const wn8Span =
    current.minWn8 !== null && current.maxWn8 !== null
      ? tFilters('between', { from: format.number(current.minWn8), to: format.number(current.maxWn8) })
      : current.minWn8 !== null
        ? tFilters('atLeast', { value: format.number(current.minWn8) })
        : current.maxWn8 !== null
          ? tFilters('atMost', { value: format.number(current.maxWn8) })
          : null;

  const active: ActiveFilter[] = [
    ...(current.tier === null
      ? []
      : [
          { id: 'tier', label: tFilters('span', { label: t('tier'), value: toRoman(current.tier) }), onRemove: () => void setFilters({ tier: null }) }
        ]),
    ...(current.mode
      ? [
          {
            id: 'mode',
            label: tFilters('span', { label: t('mode'), value: isPlatoonMode(current.mode) ? tModes(current.mode) : current.mode }),
            onRemove: () => void setFilters({ mode: null })
          }
        ]
      : []),
    ...(current.voice === 'any'
      ? []
      : [{ id: 'voice', label: t(`voiceOptions.${current.voice}`), onRemove: () => void setFilters({ voice: null }) }]),
    ...(wn8Span
      ? [{ id: 'wn8', label: tFilters('span', { label: wn8, value: wn8Span }), onRemove: () => void setFilters({ minWn8: null, maxWn8: null }) }]
      : []),
    ...(availableAt
      ? [
          {
            id: 'at',
            label: tFilters('span', { label: t('at'), value: format.dateTime(new Date(availableAt), PLATOON_TIME_FORMAT) }),
            onRemove: () => void setFilters({ at: null })
          }
        ]
      : [])
  ];

  return {
    filters: current,
    isFiltered: hasActiveFilters(current),
    active,
    wn8,
    tierValue: current.tier === null ? [] : [current.tier],
    modeItems: [{ value: PLATOON_BOARD.anyMode, label: t('anyMode') }, ...PLATOON_MODES.map((mode) => ({ value: mode, label: tModes(mode) }))],
    modeValue: current.mode ?? PLATOON_BOARD.anyMode,
    onTiersChange: (next: number[]) => void setFilters({ tier: next[0] ?? null }),
    onModeChange: (mode: string) => void setFilters({ mode: mode === PLATOON_BOARD.anyMode ? null : mode }),
    onVoiceChange: (voice: PlatoonVoiceFilter) => void setFilters({ voice }),
    onMinWn8Change: (value: number | null) => void setFilters({ minWn8: toWn8Bound(String(value ?? '')) }),
    onMaxWn8Change: (value: number | null) => void setFilters({ maxWn8: toWn8Bound(String(value ?? '')) }),
    onAtChange: (value: string) => void setFilters({ at: value === '' ? null : value }),
    onReset: () => void setFilters({ tier: null, mode: null, voice: null, minWn8: null, maxWn8: null, at: null })
  };
};
