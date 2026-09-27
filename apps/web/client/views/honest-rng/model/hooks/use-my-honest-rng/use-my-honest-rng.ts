'use client';

import { useQuery } from '@tanstack/react-query';
import { useFormatter, useTranslations } from 'next-intl';
import { match, P } from 'ts-pattern';

import { useAuthSession, useLoginHref } from '@/entities/auth/session';
import { isNotFoundError } from '@/shared/api/source';
import { QUERY_KEYS } from '@/shared/constants';
import { percentText } from '@/shared/lib';

import { getMyHonestRng } from '../../../api';
import { HONEST_RNG_VIEW, RNG_LUCK_TONES } from '../../../config';
import { bucketMidpoints, bucketShares, rollPercent } from '../../../lib/rng-chart';
import { useRngPeriod } from '../use-rng-period';

export const useMyHonestRng = () => {
  const t = useTranslations('honestRng.mine');
  const format = useFormatter();
  const session = useAuthSession();
  const loginHref = useLoginHref();
  const [period] = useRngPeriod();
  const isSignedIn = Boolean(session.data?.user);
  const { data, error, isPending, isFetching, refetch } = useQuery({
    queryKey: QUERY_KEYS.honestRng.mine({ period, userId: session.data?.user.id ?? null }),
    queryFn: ({ signal }) => getMyHonestRng({ period, signal }),
    enabled: isSignedIn,
    staleTime: HONEST_RNG_VIEW.staleMs,
    retry: false
  });

  const status = match({ session: session.isPending, isSignedIn, data, error, isPending })
    .with({ session: true }, () => 'pending' as const)
    .with({ isSignedIn: false }, () => 'guest' as const)
    .with({ error: P.when(isNotFoundError) }, () => 'noAccount' as const)
    .with({ error: P.nonNullable }, () => 'error' as const)
    .with({ data: P.nonNullable }, ({ data: loaded }) => (loaded.summary.shots === 0 ? ('empty' as const) : ('ready' as const)))
    .otherwise(() => 'pending' as const);

  const buckets = data?.summary.buckets ?? [];

  return {
    status,
    loginHref,
    data: data ?? null,
    luckTone: RNG_LUCK_TONES[data?.luck ?? 'unknown'],
    meanRoll: rollPercent(data?.summary.meanRoll),
    deltaVsServer: rollPercent(data?.deltaVsServer),
    chart: {
      labels: bucketMidpoints(buckets).map((value) => format.number(value / HONEST_RNG_VIEW.percentScale, 'signedPercent')),
      series: [{ id: 'mine', label: t('series'), values: bucketShares(buckets), tone: 'accent' as const }]
    },
    formatPercent: (value: number) => percentText({ format, value, digits: 1 }),
    isRetrying: isFetching,
    retry: () => void refetch()
  };
};
