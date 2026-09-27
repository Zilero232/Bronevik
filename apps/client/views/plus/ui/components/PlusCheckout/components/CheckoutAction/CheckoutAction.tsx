'use client';

import type { CheckoutInput } from '@otmetki/schemas';

import { useFormatter, useTranslations } from 'next-intl';
import { useFormState } from 'react-hook-form';
import { match } from 'ts-pattern';

import { useLoginHref } from '@/entities/auth/session';
import { useStartTrial } from '@/entities/plus/subscription';
import { usePlus } from '@/features/plus/plus-gate';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Button, buttonVariants, Skeleton } from '@/ui-kit';

import { checkoutNote } from '../../../../../lib/checkout-note';

import s from './CheckoutAction.module.scss';

export const CheckoutAction = () => {
  const loginHref = useLoginHref();
  const t = useTranslations('plus');
  const format = useFormatter();
  const access = usePlus();
  const trial = useStartTrial();
  const { isSubmitting, isSubmitSuccessful } = useFormState<CheckoutInput>();

  const { isPending, isSignedIn, isPlus, isCheckoutAvailable, trialAvailable, trialDays } = access;
  const isRedirecting = isSubmitting || isSubmitSuccessful;
  const note = checkoutNote(access);

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
              <Button disabled={trial.isPending} type='button' variant={isCheckoutAvailable ? 'secondary' : 'primary'} onClick={() => trial.mutate()}>
                {trial.isPending ? t('checkout.action.trialPending') : t('checkout.action.trial', { days: trialDays })}
              </Button>
            )}
            {isCheckoutAvailable ? (
              <Button disabled={isRedirecting} type='submit'>
                {isRedirecting ? t('checkout.action.redirecting') : t('checkout.action.buy')}
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
