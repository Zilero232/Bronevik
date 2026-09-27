import { RotateCcw, Trash2 } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button, ConfirmDialog } from '@/ui-kit';

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
      <ConfirmDialog
        trigger={
          <Button aria-label={common('delete')} disabled={isDeleting} size='icon' title={common('delete')} variant='ghost'>
            <Trash2 aria-hidden />
          </Button>
        }
        cancelLabel={common('cancel')}
        confirmLabel={common('delete')}
        description={t('deleteDescription')}
        isPending={isDeleting}
        title={t('deleteTitle', { date: dateLabel })}
        tone='danger'
        onConfirm={onDelete}
      />
    </div>
  );
};
