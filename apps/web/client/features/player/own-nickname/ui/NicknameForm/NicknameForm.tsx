'use client';

import { clsx } from 'clsx';
import { UserRound } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { Button, Input } from '@/ui-kit';

import type { NicknameFormProps } from './NicknameForm.types';

import { OWN_NICKNAME } from '../../config';
import { useNicknameForm } from '../../model/hooks';

import s from './NicknameForm.module.scss';

export const NicknameForm = ({ onDone, size = 'md', isLabelShown = true, className }: NicknameFormProps) => {
  const t = useTranslations('ownPlayer.form');
  const id = useId();
  const { register, onSubmit, error, isSubmitting } = useNicknameForm({ onDone });

  const hintId = `${id}-hint`;

  return (
    <form noValidate className={clsx(s.root, className)} onSubmit={onSubmit}>
      <label className={s.label} data-shown={isLabelShown} htmlFor={id}>
        {t('label')}
      </label>
      <div className={s.row}>
        <Input
          aria-describedby={hintId}
          aria-invalid={error !== null}
          autoCapitalize='off'
          autoComplete='nickname'
          icon={<UserRound aria-hidden size={OWN_NICKNAME.iconSize + 2} />}
          id={id}
          isInvalid={error !== null}
          placeholder={t('placeholder')}
          size={size}
          spellCheck={false}
          wrapperClassName={s.input}
          {...register('nickname')}
        />
        <Button disabled={isSubmitting} size={size} type='submit'>
          {isSubmitting ? t('checking') : t('submit')}
        </Button>
      </div>
      <p aria-live='polite' className={s.hint} data-invalid={error !== null} id={hintId}>
        {error ? t(`errors.${error}`) : t('hint')}
      </p>
    </form>
  );
};
