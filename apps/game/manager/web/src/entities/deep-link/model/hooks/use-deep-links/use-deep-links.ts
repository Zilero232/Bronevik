import { useEffect, useEffectEvent } from 'react';

import { listenEvent } from '@/shared/api';
import { EVENTS } from '@/shared/config';

import type { UseDeepLinksInput } from './use-deep-links.types';

import { deepLinkSchema, takeDeepLink } from '../../../api';

export const useDeepLinks = ({ onLink }: UseDeepLinksInput) => {
  const handle = useEffectEvent(onLink);

  useEffect(() => {
    const deliver = async () => {
      const link = await takeDeepLink().catch(() => null);

      if (link) {
        handle(link);
      }
    };

    void deliver();

    const unlisten = listenEvent({ event: EVENTS.deepLink, schema: deepLinkSchema, onPayload: () => void deliver() });

    return () => {
      void unlisten.then((stop) => stop());
    };
  }, []);
};
