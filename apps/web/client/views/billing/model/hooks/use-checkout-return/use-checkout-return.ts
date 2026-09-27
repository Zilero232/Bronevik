'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { parseAsString, useQueryState } from 'nuqs';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { QUERY_KEYS } from '@/shared/constants';

import { CHECKOUT_RETURN } from '../../../config';

export const useCheckoutReturn = () => {
  const t = useTranslations('billing.toast');
  const queryClient = useQueryClient();
  const [checkout, setCheckout] = useQueryState(CHECKOUT_RETURN.param, parseAsString.withOptions({ history: 'replace' }));

  useEffect(() => {
    if (checkout !== CHECKOUT_RETURN.value) {
      return;
    }

    toast.success(t('checkoutReturn'), { id: CHECKOUT_RETURN.toastId });
    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.me.billing.status });
    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.me.billing.history });
    void setCheckout(null);
    // eslint-disable-next-line react/exhaustive-deps -- fire once per return from YooKassa; the client, setter and translator are stable
  }, [checkout]);
};
