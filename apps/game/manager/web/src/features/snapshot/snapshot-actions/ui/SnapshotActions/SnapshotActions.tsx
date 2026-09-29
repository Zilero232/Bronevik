import { RotateCcw } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button, ConfirmDialog, DeleteButton } from '@/ui-kit';

import type { SnapshotActionsProps } from './SnapshotActions.types';

import { useSnapshotActions } from '../../model/hooks';

import s from './SnapshotActions.module.scss';

export const SnapshotActions = ({ clientPath, id, dateLabel }: SnapshotActionsProps) => {
  const t = useTranslations('backups');
  const common = useTranslations('common');
  const { isRestoring, isDeleting, onRestore, onDelete } = useSnapshotActions({ clientPath, id });

  return (
    <div className={s.root}>
      <ConfirmDialog
        trigger={
          <Button isPending={isRestoring} size='sm' variant='secondary'>
            {!isRestoring && <RotateCcw aria-hidden />}
            {t('restore')}
          </Button>
        }
        cancelLabel={common('cancel')}
        confirmLabel={t('restore')}
        description={t('restoreDescription')}
        isPending={isRestoring}
        title={t('restoreTitle', { date: dateLabel })}
        onConfirm={onRestore}
      />
      <DeleteButton
        cancelLabel={common('cancel')}
        description={t('deleteDescription')}
        disabled={isDeleting}
        isPending={isDeleting}
        label={common('delete')}
        title={t('deleteTitle', { date: dateLabel })}
        onConfirm={onDelete}
      />
    </div>
  );
};
