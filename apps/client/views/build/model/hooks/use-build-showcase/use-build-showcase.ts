'use client';

import { skipToken, useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useQueryState } from 'nuqs';
import { take } from 'remeda';
import { match } from 'ts-pattern';

import type { StatListItem } from '@/ui-kit';

import { getRecommendedBuild } from '@/entities/tank/build';
import { getTank } from '@/entities/tank/tank';
import { usePlus } from '@/features/plus/plus-gate';
import { QUERY_KEYS, ROUTES } from '@/shared/constants';
import { deltaVerdict } from '@/shared/lib';

import type { BuildShowcaseSource } from './use-build-showcase.types';

import { BUILD_VIEW, SHOWCASE, SHOWCASE_PARSERS } from '../../../config';
import { crewColumns, equipmentMatrix, fieldModRing, shellMix } from '../../../lib/showcase';
import { useBuildContext } from '../../context';
import { useBuildView } from '../use-build-view';
import { useShareLink } from '../use-share-link';

const PLUS_SOURCES: readonly string[] = SHOWCASE.plusSources;

export const useBuildShowcase = () => {
  const t = useTranslations('builds.showcase');
  const { vehicle, options, catalog, edit } = useBuildContext();
  const { isPlus } = usePlus();
  const { onViewChange } = useBuildView();
  const share = useShareLink();
  const [picked, setPicked] = useQueryState('source', SHOWCASE_PARSERS.source.withOptions({ history: 'replace' }));

  const source = !isPlus && PLUS_SOURCES.includes(picked) ? 'top10' : picked;
  const other = SHOWCASE.otherSource[source];
  const params = { tankId: vehicle.tankId, mode: SHOWCASE.mode, cohort: source };
  const otherParams = { tankId: vehicle.tankId, mode: SHOWCASE.mode, cohort: other };
  const statsParams = { idOrSlug: vehicle.slug, period: SHOWCASE.period };

  const query = useQuery({
    queryKey: QUERY_KEYS.builds.recommended(params),
    queryFn: ({ signal }) => getRecommendedBuild({ ...params, signal }),
    staleTime: BUILD_VIEW.staleMs
  });

  const otherQuery = useQuery({
    queryKey: QUERY_KEYS.builds.recommended(otherParams),
    queryFn: query.isSuccess ? ({ signal }) => getRecommendedBuild({ ...otherParams, signal }) : skipToken,
    staleTime: BUILD_VIEW.staleMs
  });

  const statsQuery = useQuery({
    queryKey: QUERY_KEYS.tanks.detail(statsParams),
    queryFn: ({ signal }) => getTank({ ...statsParams, signal }),
    staleTime: BUILD_VIEW.staleMs
  });

  const usage = query.data?.usage ?? null;
  const otherUsage = otherQuery.data?.usage ?? null;
  const loadout = query.data?.loadout ?? null;
  const detail = statsQuery.data ?? null;
  const row =
    detail?.serverStats.find(({ cohort, mode }) => cohort === SHOWCASE.statsCohort && mode === SHOWCASE.statsMode) ?? detail?.serverStats[0] ?? null;

  const pairs = fieldModRing({ steps: catalog.fieldSteps, usage });
  const half = Math.ceil(pairs.length / 2);

  const stats: StatListItem[] = [
    { id: 'winRate', label: t('stats.winRate'), value: row?.winRate, kind: 'percent', isHighlighted: true },
    { id: 'avgFrags', label: t('stats.avgFrags'), value: row?.avgFrags, kind: 'decimal' },
    { id: 'avgDamage', label: t('stats.avgDamage'), value: row?.avgDamage },
    { id: 'avgSpotted', label: t('stats.avgSpotted'), value: row?.avgSpotted, kind: 'decimal' },
    { id: 'master', label: t('stats.master'), value: detail?.mastery?.master, suffix: t('stats.xp') },
    { id: 'avgBlocked', label: t('stats.avgBlocked'), value: row?.avgBlocked },
    { id: 'threeMarks', label: t('stats.threeMarks'), value: detail?.moe?.p95 },
    { id: 'accuracy', label: t('stats.accuracy'), value: row?.accuracy, kind: 'percent' }
  ];

  const comparison = [
    { id: 'winRate' as const, value: usage?.winRate ?? null, other: otherUsage?.winRate ?? null, isPercent: true },
    { id: 'avgDamage' as const, value: usage?.avgDamage ?? null, other: otherUsage?.avgDamage ?? null, isPercent: false }
  ].map((item) => {
    const delta = item.value !== null && item.other !== null ? item.value - item.other : null;

    return { ...item, delta, verdict: delta === null ? null : deltaVerdict({ value: delta }) };
  });

  const status = match({ isPending: query.isPending, isError: query.isError })
    .with({ isPending: true }, () => 'pending' as const)
    .with({ isError: true }, () => 'error' as const)
    .otherwise(() => 'ready' as const);

  const onSourceChange = (next: BuildShowcaseSource) => {
    void setPicked(next);
  };

  const onOpenEditor = () => {
    if (loadout) {
      edit(() => loadout);
    }

    onViewChange('editor');
  };

  const onShare = () => void share();

  const onRetry = () => {
    void query.refetch();
  };

  return {
    vehicle,
    source,
    other,
    isPlus,
    status,
    isRetrying: query.isFetching,
    usage,
    comparison,
    leftPairs: pairs.slice(0, half),
    rightPairs: pairs.slice(half),
    stats,
    hasStats: row !== null,
    isStatsPending: statsQuery.isPending,
    crew: usage ? crewColumns({ usage, limit: SHOWCASE.skillsPerRole }) : [],
    equipment: usage ? equipmentMatrix({ usage, devices: options.optionalDevices, slots: options.slots.optionalDevices }) : [],
    consumables: take(usage?.consumables ?? [], SHOWCASE.consumables),
    shells: usage ? shellMix({ shells: usage.shells }) : [],
    hasLoadout: loadout !== null,
    tanksHref: {
      nation: `${ROUTES.tanks.list}?nations=${vehicle.nation}`,
      type: `${ROUTES.tanks.list}?types=${vehicle.type}`,
      tier: `${ROUTES.tanks.list}?tiers=${vehicle.tier}`
    },
    onSourceChange,
    onOpenEditor,
    onShare,
    onRetry
  };
};
