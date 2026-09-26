'use client';

import { useFormatter, useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { useLoginHref } from '@/entities/auth/session';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Button, buttonVariants, Skeleton } from '@/ui-kit';

import type { CheckoutActionProps } from './CheckoutAction.types';

import s from './CheckoutAction.module.scss';

export const CheckoutAction = ({
  isSignedIn,
  isPlus,
  isPending,
  isSubmitting,
  isCheckoutAvailable,
  trialAvailable,
  trialDays,
  isStartingTrial,
  note,
  onStartTrial
}: CheckoutActionProps) => {
  const loginHref = useLoginHref();
  const t = useTranslations('plus');
  const format = useFormatter();

  return (
    <div className={s.root}>
      {match({ isPending, isSignedIn, isPlus })
        .with({ isPending: true }, () => <Skeleton height={40} shape='block' width={220} />)
        .with({ isSignedIn: false }, () => (
          <Link className={buttonVariants()} href={loginHref}>
            {t('checkout.action.signIn')}
          </Link>
        ))
        .with({ isPlus: true }, () => (
          <Link className={buttonVariants({ variant: 'secondary' })} href={ROUTES.account.billing}>
            {t('checkout.action.manage')}
          </Link>
        ))
        .otherwise(() => (
          <>
            {trialAvailable && (
              <Button disabled={isStartingTrial} type='button' variant={isCheckoutAvailable ? 'secondary' : 'primary'} onClick={onStartTrial}>
                {isStartingTrial ? t('checkout.action.trialPending') : t('checkout.action.trial', { days: trialDays })}
              </Button>
            )}
            {isCheckoutAvailable ? (
              <Button disabled={isSubmitting} type='submit'>
                {isSubmitting ? t('checkout.action.redirecting') : t('checkout.action.buy')}
              </Button>
            ) : (
              <Button disabled type='button' variant='secondary'>
                {t('checkout.action.closed')}
              </Button>
            )}
          </>
        ))}
      <p className={s.note}>
        {note.kind === 'state'
          ? t(`state.${note.state}`, { date: note.periodEnd ? format.dateTime(new Date(note.periodEnd), { dateStyle: 'long' }) : '—' })
          : t(`checkout.action.${note.key}`)}
      </p>
    </div>
  );
};
