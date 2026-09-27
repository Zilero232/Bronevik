'use client';

import { useTranslations } from 'next-intl';

import { Badge, Button, Input } from '@/ui-kit';

import { useMagicLinkForm } from '../../../model/hooks';

import s from './MagicLinkForm.module.scss';

export const MagicLinkForm = () => {
  const t = useTranslations('auth.magic');
  const { register, onSubmit, isInvalid, isFailed, isPending } = useMagicLinkForm();

  return (
    <form noValidate className={s.root} onSubmit={onSubmit}>
      <div className={s.head}>
        <span className={s.title}>{t('title')}</span>
        <Badge tone='warning'>{t('dev')}</Badge>
      </div>
      <Input aria-label={t('email')} autoComplete='email' isInvalid={isInvalid} placeholder={t('placeholder')} type='email' {...register('email')} />
      {isInvalid && <p className={s.error}>{t('invalid')}</p>}
      {isFailed && (
        <p className={s.error} role='alert'>
          {t('failed')}
        </p>
      )}
      <Button block disabled={isPending} type='submit' variant='ghost'>
        {t('submit')}
      </Button>
    </form>
  );
};
