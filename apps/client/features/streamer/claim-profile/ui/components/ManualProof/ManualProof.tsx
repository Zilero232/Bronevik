'use client';

import { Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { Button, Card, CardHeader, FormField, Textarea } from '@/ui-kit';

import type { ManualProofProps } from './ManualProof.types';

import { CLAIM_PROFILE } from '../../../config';
import { useManualClaimForm } from '../../../model/hooks';

import s from './ManualProof.module.scss';

export const ManualProof = ({ slug }: ManualProofProps) => {
  const t = useTranslations('streamersDirectory.claim.manual');
  const id = useId();
  const { register, errors, isSubmitting, onSubmit } = useManualClaimForm(slug);

  return (
    <Card className={s.root} padding='md'>
      <CardHeader title={t('title')} />
      <p className={s.description}>{t('description')}</p>
      <form noValidate className={s.form} onSubmit={onSubmit}>
        <FormField
          error={errors.evidence && t('evidenceError', { min: CLAIM_PROFILE.evidenceMin, max: CLAIM_PROFILE.evidenceMax })}
          hint={t('evidenceHint')}
          htmlFor={id}
          label={t('evidence')}
        >
          <Textarea
            id={id}
            isInvalid={Boolean(errors.evidence)}
            maxLength={CLAIM_PROFILE.evidenceMax}
            rows={CLAIM_PROFILE.evidenceRows}
            {...register('evidence')}
          />
        </FormField>
        <div className={s.actions}>
          <Button disabled={isSubmitting} size='sm' type='submit' variant='secondary'>
            <Send size={CLAIM_PROFILE.iconSize} />
            {t('submit')}
          </Button>
        </div>
      </form>
    </Card>
  );
};
