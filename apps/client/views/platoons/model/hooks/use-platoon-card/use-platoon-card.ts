'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormatter, useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { pickVehicles } from '@/entities/tank/tank';
import { communityErrorKind } from '@/features/community/api-error';
import { useCommunityViewer } from '@/features/community/viewer';
import { useVehicleCatalog } from '@/features/tank/pick-tank';
import { QUERY_KEYS, ROUTES } from '@/shared/constants';
import { useClientNow } from '@/shared/lib';

import type { PlatoonPost } from '../../../api';

import { closePlatoon } from '../../../api';
import { PLATOON_BOARD, PLATOON_TIME_FORMAT } from '../../../config';
import { availabilityWindow } from '../../../lib/availability';
import { isPlatoonMode } from '../../../lib/platoon-query';

export const usePlatoonCard = (post: PlatoonPost) => {
  const t = useTranslations('platoons');
  const format = useFormatter();
  const queryClient = useQueryClient();
  const now = useClientNow({ updateInterval: PLATOON_BOARD.nowTickMs });
  const { ownsAccount } = useCommunityViewer();
  const { data: catalog } = useVehicleCatalog();
  const close = useMutation({
    mutationFn: () => closePlatoon(post.id),
    onSuccess: async () => {
      toast.success(t('toast.closed'));
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.platoons.all });
    },
    onError: (error) => toast.error(t(`errors.${communityErrorKind(error)}`))
  });

  const availability = availabilityWindow({ from: post.availableFrom, until: post.availableUntil, now });

  return {
    vehicles: pickVehicles({ tankIds: post.tankIds, catalog }),
    availabilityText: t(`card.availability.${availability.state}`, {
      from: availability.from ? format.dateTime(availability.from, PLATOON_TIME_FORMAT) : '',
      until: availability.until ? format.dateTime(availability.until, PLATOON_TIME_FORMAT) : '',
      hasUntil: availability.until ? 'yes' : 'no'
    }),
    availabilityState: availability.state,
    modesText: post.modes.map((mode) => (isPlatoonMode(mode) ? t(`modes.${mode}`) : mode)).join(', '),
    profileHref: ROUTES.players.profile(post.nickname ?? String(post.accountId)),
    isOwn: ownsAccount(post.accountId),
    isClosing: close.isPending,
    onClose: () => close.mutate()
  };
};
