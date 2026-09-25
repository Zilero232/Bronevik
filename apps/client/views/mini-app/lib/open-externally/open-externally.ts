import type { MouseEvent } from 'react';

import { openLink } from '@tma.js/sdk-react';

export const openExternally = (event: MouseEvent<HTMLAnchorElement>) => {
  if (!openLink.isAvailable()) {
    return;
  }

  event.preventDefault();
  openLink(event.currentTarget.href);
};
