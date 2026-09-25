'use client';

import type { PromoRedeemInput } from '@bronevik/schemas';

import { PROMO_CODE, promoRedeemSchema } from '@bronevik/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { TicketPercent } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { useForm } from 'react-hook-form';

import { Button, Card, CardHeader, Input } from '@/ui-kit';

import { useRedeemPromo } from '../../../model/hooks';

import s from './PromoRedeemCard.module.scss';

const DEFAULT_VALUES: PromoRedeemInput = { code: '' };

export const PromoRedeemCard = () => {
  const t = useTranslations('billing.promo');
  const redeem = useRedeemPromo();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<PromoRedeemInput>({ resolver: zodResolver(promoRedeemSchema), defaultValues: DEFAULT_VALUES });

  const id = useId();

  const error = errors.code;
  const message = error && (error.type === 'server' ? t('rejected') : t('invalid', { min: PROMO_CODE.minLength, max: PROMO_CODE.maxLength }));

  const onSubmit = handleSubmit(async (values) => {
    try {
      await redeem.mutateAsync(values);
      reset(DEFAULT_VALUES);
    } catch {
      setError('code', { type: 'server' });
    }
  });

  return (
    <Card className={s.root} padding='lg'>
      <CardHeader eyebrow={t('eyebrow')} title={t('title')} />
      <p className={s.lead}>{t('description')}</p>
      <form noValidate className={s.form} onSubmit={onSubmit}>
        <label className={s.label} htmlFor={id}>
          {t('label')}
        </label>
        <div className={s.row}>
          <Input
            aria-describedby={`${id}-hint`}
            aria-invalid={Boolean(error)}
            autoComplete='off'
            icon={<TicketPercent size={16} />}
            id={id}
            isInvalid={Boolean(error)}
            maxLength={PROMO_CODE.maxLength}
            placeholder={t('placeholder')}
            spellCheck={false}
            wrapperClassName={s.input}
            {...register('code')}
          />
          <Button disabled={isSubmitting} type='submit' variant='secondary'>
            {t('submit')}
          </Button>
        </div>
        <p className={s.hint} data-invalid={Boolean(error)} id={`${id}-hint`} role={error ? 'alert' : undefined}>
          {message ?? t('hint')}
        </p>
      </form>
    </Card>
  );
};
