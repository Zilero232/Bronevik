'use client';

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
        .with({ isPending: true }, () => <Skeleton height={40} shape='block' width={220} />)
        .with({ isSignedIn: false }, () => (
          <Link className={buttonVariants()} href={ROUTES.login}>
            {t('signIn')}
          </Link>
        ))
        .with({ isPlus: true }, () => (
          <Link className={buttonVariants({ variant: 'secondary' })} href={ROUTES.account.billing}>
            {t('manage')}
          </Link>
        ))
        .otherwise(() => (
          <Button disabled={isSubmitting} type='submit'>
            {isSubmitting ? t('redirecting') : t('buy')}
          </Button>
        ))}
      <p className={s.note}>{t(isPlus ? 'notePlus' : 'note')}</p>
    </div>
  );
};
