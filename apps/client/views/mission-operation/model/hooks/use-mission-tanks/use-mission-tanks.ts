'use client';

import { useQuery } from '@tanstack/react-query';
import { match } from 'ts-pattern';

import { useAuthSession } from '@/entities/auth/session';
import { getMissionGarage, getMissionTanks } from '@/entities/mission/mission';
import { QUERY_KEYS } from '@/shared/constants';

import type { UseMissionTanksInput } from './use-mission-tanks.types';

import { GARAGE_NOTICE, MISSION_BOARD, MISSION_TANKS_VIEW } from '../../../config';
import { useMissionGarageColumns } from '../use-mission-garage-columns';
import { useMissionTanksColumns } from '../use-mission-tanks-columns';

export const useMissionTanks = ({ questId, metric }: UseMissionTanksInput) => {
  const { data: session } = useAuthSession();
  const columns = useMissionTanksColumns(metric);
  const garageColumns = useMissionGarageColumns(metric);
  const tanks = useQuery({
    queryKey: QUERY_KEYS.missions.tanks({ questId, period: MISSION_TANKS_VIEW.period }),
    queryFn: ({ signal }) => getMissionTanks({ questId, period: MISSION_TANKS_VIEW.period, signal })
  });

  const garage = useQuery({
    queryKey: QUERY_KEYS.missions.garage(questId),
    queryFn: ({ signal }) => getMissionGarage({ questId, signal }),
    enabled: Boolean(session),
    retry: false
  });

  const isSignedIn = Boolean(session);
  const garageNotice = match({ isSignedIn, state: garage.data?.state })
    .with({ isSignedIn: false }, () => GARAGE_NOTICE.signIn)
    .with({ state: 'noLink' }, () => GARAGE_NOTICE.noLink)
    .with({ state: 'noPrivateData' }, () => GARAGE_NOTICE.noPrivateData)
    .otherwise(() => null);

  return {
    columns,
    garageColumns,
    tanks: tanks.data,
    showcase: (tanks.data?.tanks ?? []).slice(0, MISSION_BOARD.showcaseLimit),
    isPending: tanks.isPending,
    isError: tanks.isError,
    isRetrying: tanks.isFetching,
    retry: () => void tanks.refetch(),
    garageNotice,
    isGarageLoading: garage.isPending,
    isGarageError: garage.isError,
    isGarageRetrying: garage.isFetching,
    retryGarage: () => void garage.refetch(),
    garageTanks: (garage.data?.tanks ?? []).slice(0, MISSION_TANKS_VIEW.garageLimit)
  };
};
