'use client';

import type { VehicleSummary } from '@otmetki/schemas';

import { ROUTES } from '@/shared/constants';
import { useRouter } from '@/shared/i18n/navigation';

import { useBuildContext } from '../../context';
import { useShareLink } from '../use-share-link';

export const useBuildHead = () => {
  const router = useRouter();
  const { vehicle } = useBuildContext();
  const share = useShareLink();

  const onPick = (next: VehicleSummary | null) => {
    if (next && next.slug !== vehicle.slug) {
      router.push(ROUTES.build(next.slug));
    }
  };

  const onShare = () => void share();

  return { vehicle, onPick, onShare };
};
