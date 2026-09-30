import { atom } from 'nanostores';

import type { RememberScrollInput, ScrollTops } from './scroll.types';

import { send } from '../../../../shared/api/protocol';

export const $scroll = atom<ScrollTops>({});

export const seedScroll = (tops: ScrollTops): void => {
  $scroll.set(tops);
};

export const rememberScroll = ({ page, top }: RememberScrollInput): void => {
  const rounded = Math.round(top);

  if ($scroll.get()[page] === rounded) {
    return;
  }

  $scroll.set({ ...$scroll.get(), [page]: rounded });
  send({ type: 'scroll', page, top: rounded });
};
