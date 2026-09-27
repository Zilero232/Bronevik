'use client';

import { NotebookPen } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { FormDialog } from '@/features/community/form-dialog';
import { buttonVariants, FormField, Textarea } from '@/ui-kit';

import type { NotesDialogProps } from './NotesDialog.types';

import { CANDIDATE_NOTES } from '../../../../../config';
import { useCandidateNotesForm } from '../../../../../model/hooks';

export const NotesDialog = ({ clanId, candidate }: NotesDialogProps) => {
  const t = useTranslations('clanWorkspace.recruits');
  const id = useId();
  const dialog = useCandidateNotesForm({ clanId, candidate });
  const { errors } = dialog.form.formState;

  return (
    <FormDialog
      dialog={dialog}
      namespace='clanWorkspace.recruits.notesDialog'
      triggerClassName={buttonVariants({ variant: 'ghost', size: 'sm' })}
      triggerIcon={NotebookPen}
    >
      <FormField error={errors.notes && t('notesError', { max: CANDIDATE_NOTES.maxLength })} htmlFor={`${id}-notes`} label={t('notes')}>
        <Textarea
          id={`${id}-notes`}
          isInvalid={Boolean(errors.notes)}
          maxLength={CANDIDATE_NOTES.maxLength}
          placeholder={t('notesPlaceholder')}
          rows={CANDIDATE_NOTES.rows}
          {...dialog.form.register('notes')}
        />
      </FormField>
    </FormDialog>
  );
};
