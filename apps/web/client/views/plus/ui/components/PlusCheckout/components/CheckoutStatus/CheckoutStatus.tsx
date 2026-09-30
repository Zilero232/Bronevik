'use client';

import { Clock, Info } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Skeleton } from '@/ui-kit';

import type { CheckoutStatusProps } from './CheckoutStatus.types';

import { CheckoutNotify } from '../CheckoutNotify';

import s from './CheckoutStatus.module.scss';

export const CheckoutStatus = ({ isPending, isClosed, canNotify, note }: CheckoutStatusProps) => {
  const t = useTranslations('plus.checkout.action');
  const Icon = isClosed ? Clock : Info;

  if (isPending) {
    return (
      <div aria-hidden className={s.root}>
        <Skeleton className={s.iconSkeleton} shape='circle' />
        <div className={s.body}>
          <Skeleton count={2} />
        </div>
      </div>
    );
  }

  return (
    <div className={s.root} data-closed={isClosed}>
      <Icon aria-hidden className={s.icon} size={20} />
      <div className={s.body}>
        {isClosed && <p className={s.title}>{t('closedTitle')}</p>}
        <p className={s.text}>{note}</p>
        {canNotify && <CheckoutNotify />}
      </div>
    </div>
  );
};
