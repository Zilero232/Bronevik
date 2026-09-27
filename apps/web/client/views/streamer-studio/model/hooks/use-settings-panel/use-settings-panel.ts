'use client';

import { useMyStreamerSettings } from '../use-streamer-settings';
import { useStudioTab } from '../use-studio-tab';

export const useSettingsPanel = () => {
  const query = useMyStreamerSettings();
  const [, setTab] = useStudioTab();

  const onOpenProfile = () => void setTab('profile');

  return { query, onOpenProfile };
};
