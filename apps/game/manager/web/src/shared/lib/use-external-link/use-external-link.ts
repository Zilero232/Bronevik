import type { MouseEvent } from 'react';

import { openUrl } from '@tauri-apps/plugin-opener';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

export const useExternalLink = (href: string) => {
  const t = useTranslations('common');

  return (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    openUrl(href).catch(() => toast.error(t('linkBlocked')));
  };
};
