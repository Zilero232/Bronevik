'use client';

import { PROMO_CODE } from '@bronevik/schemas';
import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { Button, Card, CardHeader, Input } from '@/ui-kit';

import { usePromoRedeemForm } from '../../../model/hooks';

import s from './PromoRedeemCard.module.scss';

export const PromoRedeemCard = () => {
  const t = useTranslations('billing.promo');
  const { register, onSubmit, error, isSubmitting } = usePromoRedeemForm();
  const id = useId();

  const message = error && (error.type === 'server' ? t('rejected') : t('invalid', { min: PROMO_CODE.minLength, max: PROMO_CODE.maxLength }));

  return (
    <Card className={s.root} padding='lg'>
      <CardHeader title={t('title')} />
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
