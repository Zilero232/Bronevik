import { Copy, CopyPlus, FileDown, Pencil, Play } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button, DeleteButton, IconButton, NameDialog } from '@/ui-kit';

import type { SetActionsProps } from './SetActions.types';

import { useSetActions } from '../model/hooks';

import s from './SetActions.module.scss';

export const SetActions = ({ set }: SetActionsProps) => {
  const t = useTranslations('sets');
  const common = useTranslations('common');
  const { dialog, nameField, nameError, isPending, onApply, onOpenDialog, onCloseDialog, onDelete, onCopyCode, onExportFile, onSubmitName } =
    useSetActions({ set });

  return (
    <div aria-label={set.name} className={s.root} role='group'>
      <Button disabled={isPending} size='sm' variant='secondary' onClick={onApply}>
        <Play aria-hidden />
        {t('apply')}
      </Button>
      <IconButton disabled={isPending} label={t('copyCode')} onClick={onCopyCode}>
        <Copy aria-hidden />
      </IconButton>
      <IconButton disabled={isPending} label={t('exportFile')} onClick={onExportFile}>
        <FileDown aria-hidden />
      </IconButton>
      <IconButton disabled={isPending} label={t('duplicate')} onClick={() => onOpenDialog('duplicate')}>
        <CopyPlus aria-hidden />
      </IconButton>
      <IconButton disabled={isPending} label={t('rename')} onClick={() => onOpenDialog('rename')}>
        <Pencil aria-hidden />
      </IconButton>
      <DeleteButton
        cancelLabel={common('cancel')}
        description={t('deleteDescription')}
        disabled={isPending}
        label={common('delete')}
        title={t('deleteTitle', { name: set.name })}
        onConfirm={onDelete}
      />
      <NameDialog
        error={nameError}
        field={nameField}
        isPending={isPending}
        label={t('name')}
        open={dialog !== null}
        submitLabel={common('save')}
        title={t(dialog === 'duplicate' ? 'duplicateTitle' : 'renameTitle')}
        onOpenChange={(open) => (open ? undefined : onCloseDialog())}
        onSubmit={onSubmitName}
      />
    </div>
  );
};
