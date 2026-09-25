'use client';

import { Crown, LogIn, Settings2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Button, buttonVariants, Skeleton } from '@/ui-kit';

import type { CheckoutActionProps } from './CheckoutAction.types';

import s from './CheckoutAction.module.scss';

export const CheckoutAction = ({ isSignedIn, isPlus, isPending, isSubmitting }: CheckoutActionProps) => {
  const t = useTranslations('plus.checkout.action');

  return (
    <div className={s.root}>
      {match({ isPending, isSignedIn, isPlus })
        .with({ isPending: true }, () => <Skeleton height={48} shape='block' width={260} />)
        .with({ isSignedIn: false }, () => (
          <Link className={buttonVariants({ size: 'lg' })} href={ROUTES.login}>
            <LogIn size={18} />
            {t('signIn')}
          </Link>
        ))
        .with({ isPlus: true }, () => (
          <Link className={buttonVariants({ variant: 'secondary', size: 'lg' })} href={ROUTES.account.billing}>
            <Settings2 size={18} />
            {t('manage')}
          </Link>
        ))
        .otherwise(() => (
          <Button className={s.buy} disabled={isSubmitting} size='lg' type='submit'>
            <Crown size={18} />
            {isSubmitting ? t('redirecting') : t('buy')}
          </Button>
        ))}
      <p className={s.note}>{t(isPlus ? 'notePlus' : 'note')}</p>
    </div>
  );
};
