'use client';

import { init, miniApp, viewport } from '@tma.js/sdk-react';
import { useEffect } from 'react';

export const useTelegramSdk = (isTelegram: boolean) => {
  useEffect(() => {
    if (!isTelegram) {
      return;
    }

    const cleanup = init();

    miniApp.mount.ifAvailable();
    miniApp.ready.ifAvailable();
    viewport.expand.ifAvailable();

    return cleanup;
  }, [isTelegram]);
};
