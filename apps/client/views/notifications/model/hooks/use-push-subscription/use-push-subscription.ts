'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { getPushKey, subscribePush, unsubscribePush } from '@/shared/api/notifications';
import { QUERY_KEYS } from '@/shared/constants';

import { currentPushSubscription, inspectPushBrowser, subscribeBrowserPush } from '../../../api/push-browser';
import { INITIAL_PUSH_BROWSER } from '../../../config';
import { resolvePushStatus } from '../../../lib/push-status';

export const usePushSubscription = () => {
  const t = useTranslations('notifications.push');
  const { data: pushKey } = useQuery({ queryKey: QUERY_KEYS.notifications.pushKey, queryFn: getPushKey, staleTime: Infinity });
  const [browser, setBrowser] = useState(INITIAL_PUSH_BROWSER);

  useEffect(() => {
    void inspectPushBrowser().then(setBrowser);
  }, []);

  const publicKey = pushKey?.publicKey;

  const subscribe = useMutation({
    mutationFn: async () => {
      const permission = await Notification.requestPermission();

      setBrowser((current) => ({ ...current, permission }));

      if (permission !== 'granted' || !publicKey) {
        return false;
      }

      await subscribePush(await subscribeBrowserPush(publicKey));

      return true;
    },
    onSuccess: (isSubscribed) => {
      if (!isSubscribed) {
        toast.info(t('dismissed'));

        return;
      }

      setBrowser((current) => ({ ...current, isSubscribed }));
      toast.success(t('subscribedToast'));
    },
    onError: () => toast.error(t('failed'))
  });

  const unsubscribe = useMutation({
    mutationFn: async () => {
      const subscription = await currentPushSubscription();

      if (subscription) {
        await unsubscribePush({ endpoint: subscription.endpoint });
        await subscription.unsubscribe();
      }
    },
    onSuccess: () => {
      setBrowser((current) => ({ ...current, isSubscribed: false }));
      toast.success(t('unsubscribedToast'));
    },
    onError: () => toast.error(t('failed'))
  });

  return {
    status: resolvePushStatus({ ...browser, publicKey }),
    subscribe,
    unsubscribe
  };
};
