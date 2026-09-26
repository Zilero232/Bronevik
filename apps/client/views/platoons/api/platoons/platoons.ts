import type { CreatePlatoon, ListPlatoonsInput, PlatoonPage, PlatoonPost } from './platoons.types';

import { platoonsControllerClosePlatoon, platoonsControllerCreatePlatoon, platoonsControllerListPlatoons } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

export const listPlatoons = ({ signal, ...query }: ListPlatoonsInput): Promise<PlatoonPage> =>
  fromSdk(() => platoonsControllerListPlatoons({ ...SESSION_REQUEST, query, signal }));

export const createPlatoon = (body: CreatePlatoon): Promise<PlatoonPost> =>
  fromSdk(() => platoonsControllerCreatePlatoon({ ...SESSION_REQUEST, body }));

export const closePlatoon = async (id: string): Promise<void> => {
  await fromSdk(() => platoonsControllerClosePlatoon({ ...SESSION_REQUEST, path: { id } }));
};
