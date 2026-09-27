'use client';

import bridge from '@vkontakte/vk-bridge';
import { useEffect } from 'react';

export const useVkBridge = (isVk: boolean) => {
  useEffect(() => {
    if (isVk) {
      void bridge.send('VKWebAppInit').catch(() => undefined);
    }
  }, [isVk]);
};
