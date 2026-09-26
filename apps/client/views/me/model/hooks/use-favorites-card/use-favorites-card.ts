'use client';

import { getFavorites, removeFavorite } from '@/features/player/toggle-favorite';

import { useMeMutation } from '../use-me-mutation';
import { useMeSection } from '../use-me-section';

export const useFavoritesCard = () => {
  const { data: favorites, isPending, isError, isFetching, refetch } = useMeSection({ section: 'favorites', fetcher: getFavorites });
  const remove = useMeMutation({ section: 'favorites', mutationFn: removeFavorite, successKey: 'favoriteRemoved' });

  return {
    favorites,
    isPending,
    isError,
    isRetrying: isFetching,
    isRemoving: remove.isPending,
    onRetry: () => void refetch(),
    onRemove: (id: string) => remove.mutate(id)
  };
};
