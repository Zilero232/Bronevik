import type { CreateFavoriteInput, Favorite } from '@otmetki/schemas';

import { meControllerAddFavorite, meControllerListFavorites, meControllerRemoveFavorite } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

export const getFavorites = (): Promise<Favorite[]> => fromSdk(() => meControllerListFavorites(SESSION_REQUEST));

export const addFavorite = (input: CreateFavoriteInput): Promise<Favorite> =>
  fromSdk(() => meControllerAddFavorite({ ...SESSION_REQUEST, body: input }));

export const removeFavorite = async (id: string): Promise<void> => {
  await fromSdk(() => meControllerRemoveFavorite({ ...SESSION_REQUEST, path: { id } }));
};
