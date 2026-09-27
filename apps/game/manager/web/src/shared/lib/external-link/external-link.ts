import type { MouseEvent } from 'react';

import { openUrl } from '@tauri-apps/plugin-opener';

export const handleExternalLink = (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
  event.preventDefault();
  void openUrl(href);
};
