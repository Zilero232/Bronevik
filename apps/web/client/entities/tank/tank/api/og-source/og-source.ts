import { getTank } from '../tanks';

export const tankOgSource = async (idOrSlug: string) => {
  'use cache';

  return getTank({ idOrSlug });
};
