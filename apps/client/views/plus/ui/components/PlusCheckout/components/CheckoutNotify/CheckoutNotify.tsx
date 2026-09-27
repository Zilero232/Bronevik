'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Skeleton, Switch } from '@/ui-kit';

import { useCheckoutNotify } from '../../../../../model/hooks';

import s from './CheckoutNotify.module.scss';

export const CheckoutNotify = () => {
  const t = useTranslations('plus.checkout.notify');
  const { isOn, isPending, onToggle } = useCheckoutNotify();

  if (isPending) {
    return <Skeleton height={40} shape='block' width={260} />;
  }

  return (
    <div className={s.root}>
      <Switch checked={isOn} label={t('label')} onCheckedChange={onToggle} />
      <Link className={s.hint} href={ROUTES.account.notifications}>
        {t('channels')}
      </Link>
    </div>
  );
};
