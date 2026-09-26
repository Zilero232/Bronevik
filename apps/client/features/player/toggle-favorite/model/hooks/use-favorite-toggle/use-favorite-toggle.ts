'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useAuthSession } from '@/entities/auth/session';
import { addFavorite, getFavorites, removeFavorite } from '../../../api';
import { QUERY_KEYS } from '@/shared/constants';

import type { UseFavoriteToggleInput } from './use-favorite-toggle.types';

export const useFavoriteToggle = ({ kind, targetId }: UseFavoriteToggleInput) => {
  const t = useTranslations('me.favorites');
  const queryClient = useQueryClient();

  const { data: session } = useAuthSession();
  const { data: favorites } = useQuery({ queryKey: QUERY_KEYS.me.section('favorites'), queryFn: getFavorites, enabled: Boolean(session) });

  const favorite = favorites?.find((item) => item.kind === kind && item.targetId === targetId);

  const toggle = useMutation({
    mutationFn: () => (favorite ? removeFavorite(favorite.id) : addFavorite({ kind, targetId }).then(() => undefined)),
    onSuccess: () => {
      toast.success(favorite ? t('removed') : t('added'));
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.me.section('favorites') });
    },
    onError: () => toast.error(t('failed'))
  });

  return { isSignedIn: Boolean(session), isFavorite: Boolean(favorite), toggle };
};
