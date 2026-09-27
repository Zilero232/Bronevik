'use client';

import type { StudioTab } from '../../../config';

import { useConnectResultToast } from '../use-connect-result-toast';
import { useStudioTab } from '../use-studio-tab';

export const useStreamerStudio = () => {
  const [tab, setTab] = useStudioTab();

  useConnectResultToast();

  const onTabChange = (next: StudioTab) => void setTab(next);

  return { tab, onTabChange };
};
