'use client';

import { useWindowScroll } from '@siberiacancode/reactuse';
import { useState } from 'react';

import { NAV_MENU } from '../../../config';

export const useHeaderCompact = () => {
  const [isCompact, setIsCompact] = useState(false);

  useWindowScroll(({ y }) => setIsCompact((wasCompact) => (wasCompact ? y > NAV_MENU.expandBelow : y > NAV_MENU.compactAbove)));

  return isCompact;
};
