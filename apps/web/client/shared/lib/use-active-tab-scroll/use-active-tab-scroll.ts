'use client';

import { useEffect, useState } from 'react';

import { ACTIVE_TAB_SCROLL } from './use-active-tab-scroll.constants';

export const useActiveTabScroll = (value: unknown) => {
  const [node, setNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const tab = node?.querySelector<HTMLElement>(ACTIVE_TAB_SCROLL.selector);

    if (!node || !tab || node.scrollWidth <= node.clientWidth) {
      return;
    }

    node.scrollTo({ left: tab.offsetLeft - (node.clientWidth - tab.offsetWidth) / 2 });
  }, [node, value]);

  return setNode;
};
