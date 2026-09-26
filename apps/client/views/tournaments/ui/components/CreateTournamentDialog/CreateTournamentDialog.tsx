'use client';

import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { FormDialog } from '@/features/community/form-dialog';
import { RequirementsFields } from '@/features/community/stat-requirements';
import { FormField, Input, Textarea } from '@/ui-kit';

import { TOURNAMENT_LIST } from '../../../config';
import { useCreateTournamentForm } from '../../../model/hooks';
import { TournamentScheduleFields } from './components';

import s from './CreateTournamentDialog.module.scss';

export const CreateTournamentDialog = () => {
  const t = useTranslations('tournaments.create');
  const id = useId();
  const { form, isOpen, isPending, onOpenChange, onSubmit } = useCreateTournamentForm();
  const { errors } = form.formState;

  return (
    <FormDialog
      trigger={
        <>
          <Plus size={14} />
          {t('open')}
        </>
      }
      cancelLabel={t('cancel')}
      description={t('description')}
      form={form}
      isOpen={isOpen}
      isPending={isPending}
      requiresLesta={false}
      submitLabel={t('submit')}
      title={t('title')}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
    >
      <FormField error={errors.title && t('titleError')} htmlFor={`${id}-title`} label={t('name')}>
        <Input id={`${id}-title`} isInvalid={Boolean(errors.title)} {...form.register('title')} />
      </FormField>
      <FormField error={errors.description && t('descriptionError')} htmlFor={`${id}-description`} label={t('about')}>
        <Textarea
          id={`${id}-description`}
          isInvalid={Boolean(errors.description)}
          placeholder={t('aboutPlaceholder')}
          rows={TOURNAMENT_LIST.descriptionRows}
          {...form.register('description')}
        />
      </FormField>
      <TournamentScheduleFields />
      <RequirementsFields />
      <p className={s.note}>{t('note')}</p>
    </FormDialog>
  );
};
