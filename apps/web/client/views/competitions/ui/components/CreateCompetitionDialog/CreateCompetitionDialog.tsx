'use client';

import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { FormDialog } from '@/features/community/form-dialog';
import { PlusTeaser } from '@/features/plus/plus-gate';
import { FormField, Input, Textarea } from '@/ui-kit';

import { COMPETITION_FORM } from '../../../config';
import { useCreateCompetitionForm } from '../../../model/hooks';
import { CompetitionRulesFields, ScoringFields } from './components';

import s from './CreateCompetitionDialog.module.scss';

export const CreateCompetitionDialog = () => {
  const t = useTranslations('competitions.create');
  const id = useId();
  const { dialog, isPrivateLocked, onResetScoring } = useCreateCompetitionForm();
  const { form } = dialog;
  const { errors } = form.formState;

  return (
    <FormDialog canSubmit={!isPrivateLocked} dialog={dialog} namespace='competitions.create' requiresLesta={false} triggerIcon={Plus}>
      <FormField error={errors.title && t('titleError')} htmlFor={`${id}-title`} label={t('name')}>
        <Input id={`${id}-title`} isInvalid={Boolean(errors.title)} {...form.register('title')} />
      </FormField>
      <FormField error={errors.description && t('descriptionError')} htmlFor={`${id}-description`} label={t('about')}>
        <Textarea
          id={`${id}-description`}
          isInvalid={Boolean(errors.description)}
          placeholder={t('aboutPlaceholder')}
          rows={COMPETITION_FORM.descriptionRows}
          {...form.register('description')}
        />
      </FormField>
      <CompetitionRulesFields />
      {isPrivateLocked && <PlusTeaser feature='privateCompetitions' />}
      <ScoringFields onReset={onResetScoring} />
      <p className={s.note}>{t('note')}</p>
    </FormDialog>
  );
};
