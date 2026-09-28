'use client';

import { useFormatter, useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Button, buttonVariants, Skeleton } from '@/ui-kit';

import { useCheckoutAction } from '../../../../../model/hooks';
import { CheckoutNotify } from '../CheckoutNotify';

import s from './CheckoutAction.module.scss';

export const CheckoutAction = () => {
  const t = useTranslations('plus');
  const format = useFormatter();
  const { access, loginHref, isTrialPending, startTrial, isRedirecting, note } = useCheckoutAction();

  const { isPending, isSignedIn, isPlus, isCheckoutAvailable, trialAvailable, trialDays } = access;

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
              <Button disabled={isTrialPending} type='button' variant={isCheckoutAvailable ? 'secondary' : 'premium'} onClick={startTrial}>
                {isTrialPending ? t('checkout.action.trialPending') : t('checkout.action.trial', { days: trialDays })}
              </Button>
            )}
            {match({ isCheckoutAvailable, trialAvailable })
              .with({ isCheckoutAvailable: true }, () => (
                <Button disabled={isRedirecting} type='submit' variant='premium'>
                  {isRedirecting ? t('checkout.action.redirecting') : t('checkout.action.buy')}
                </Button>
              ))
              .with({ trialAvailable: true }, () => (
                <Button disabled type='button' variant='secondary'>
                  {t('checkout.action.closed')}
                </Button>
              ))
              .otherwise(() => (
                <>
                  <Link className={buttonVariants({ variant: 'premium' })} href={ROUTES.account.billing}>
                    {t('teaser.promo')}
                  </Link>
                  <CheckoutNotify />
                </>
              ))}
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
