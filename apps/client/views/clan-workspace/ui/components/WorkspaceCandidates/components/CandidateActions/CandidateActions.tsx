'use client';

import { RefreshCw, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ConfirmDialog, IconButton } from '@/ui-kit';

import type { CandidateActionsProps } from './CandidateActions.types';

import { useCandidateActions } from '../../../../../model/hooks';
import { NotesDialog } from '../NotesDialog';

import s from './CandidateActions.module.scss';

export const CandidateActions = ({ clanId, candidate }: CandidateActionsProps) => {
  const t = useTranslations('clanWorkspace.recruits');
  const actions = useCandidateActions({ clanId, candidate });

  return (
    <div className={s.root}>
      <NotesDialog candidate={candidate} clanId={clanId} />
      <IconButton
        aria-label={t('refresh', { name: actions.name })}
        disabled={actions.isUpdating}
        size='sm'
        variant='ghost'
        onClick={actions.onRefresh}
      >
        <RefreshCw size={14} />
      </IconButton>
      <ConfirmDialog
        trigger={
          <IconButton aria-label={t('remove', { name: actions.name })} size='sm' variant='ghost'>
            <Trash2 size={14} />
          </IconButton>
        }
        cancelLabel={t('cancel')}
        confirmLabel={t('removeConfirm')}
        isPending={actions.isRemoving}
        title={t('removeTitle', { name: actions.name })}
        tone='danger'
        onConfirm={actions.onRemove}
      />
    </div>
  );
};
