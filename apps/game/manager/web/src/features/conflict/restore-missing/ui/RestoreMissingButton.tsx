import { ArchiveRestore } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button, ConfirmDialog } from '@/ui-kit';

import type { RestoreMissingButtonProps } from './RestoreMissingButton.types';

import { useRestoreMissing } from '../model/hooks';

export const RestoreMissingButton = ({ clientPath, count }: RestoreMissingButtonProps) => {
  const t = useTranslations();
  const { isPending, onRestore } = useRestoreMissing(clientPath);

  return (
    <ConfirmDialog
      trigger={
        <Button disabled={count === 0} isPending={isPending} size='sm'>
          <ArchiveRestore aria-hidden />
          {t('conflicts.restore', { count })}
        </Button>
      }
      cancelLabel={t('common.cancel')}
      confirmLabel={t('conflicts.restoreConfirm')}
      description={t('conflicts.restoreDescription')}
      isPending={isPending}
      title={t('conflicts.restoreTitle', { count })}
      onConfirm={onRestore}
    />
  );
};
