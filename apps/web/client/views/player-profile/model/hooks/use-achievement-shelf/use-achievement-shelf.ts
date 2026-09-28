'use client';

import { OVERVIEW } from '../../../config';
import { usePlayerAchievements } from '../use-player-achievements';
import { useProfileTab } from '../use-profile-tab';

export const useAchievementShelf = () => {
  const query = usePlayerAchievements();
  const { setTab } = useProfileTab();

  const sections = query.data ?? [];
  const items = sections.flatMap(({ items: medals }) => medals).slice(0, OVERVIEW.shelfCount);

  return {
    query,
    items,
    total: sections.reduce((sum, { items: medals }) => sum + medals.length, 0),
    openAll: () => setTab('achievements')
  };
};
