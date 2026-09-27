import { getClan } from '../clans';

export const clanOgSource = async (idOrTag: string) => {
  'use cache';

  return getClan({ idOrTag });
};
