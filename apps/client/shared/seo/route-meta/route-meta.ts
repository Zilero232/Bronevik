import { getStreamerBySlug } from '../../api/streamers';

export const streamerRouteName = async (slug: string) => {
  'use cache';

  try {
    return (await getStreamerBySlug(slug)).displayName;
  } catch {
    return slug;
  }
};
