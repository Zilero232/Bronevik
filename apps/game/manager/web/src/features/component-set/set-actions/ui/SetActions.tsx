import { Copy, CopyPlus, FileDown, Pencil, Play, Trash2 } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button, ConfirmDialog, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, FormField, TextInput } from '@/ui-kit';

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
      <Button aria-label={t('copyCode')} disabled={isPending} size='icon' title={t('copyCode')} variant='ghost' onClick={onCopyCode}>
        <Copy aria-hidden />
      </Button>
      <Button aria-label={t('exportFile')} disabled={isPending} size='icon' title={t('exportFile')} variant='ghost' onClick={onExportFile}>
        <FileDown aria-hidden />
      </Button>
      <Button
        aria-label={t('duplicate')}
        disabled={isPending}
        size='icon'
        title={t('duplicate')}
        variant='ghost'
        onClick={() => onOpenDialog('duplicate')}
      >
        <CopyPlus aria-hidden />
      </Button>
      <Button aria-label={t('rename')} disabled={isPending} size='icon' title={t('rename')} variant='ghost' onClick={() => onOpenDialog('rename')}>
        <Pencil aria-hidden />
      </Button>
      <ConfirmDialog
        trigger={
          <Button aria-label={common('delete')} disabled={isPending} size='icon' title={common('delete')} variant='ghost'>
            <Trash2 aria-hidden />
          </Button>
        }
        cancelLabel={common('cancel')}
        confirmLabel={common('delete')}
        description={t('deleteDescription')}
        title={t('deleteTitle', { name: set.name })}
        tone='danger'
        onConfirm={onDelete}
      />
      <Dialog open={dialog !== null} onOpenChange={(open) => (open ? undefined : onCloseDialog())}>
        <DialogContent>
          <form className={s.form} onSubmit={onSubmitName}>
            <DialogHeader>
              <DialogTitle>{t(dialog === 'duplicate' ? 'duplicateTitle' : 'renameTitle')}</DialogTitle>
            </DialogHeader>
            <FormField error={nameError} label={t('name')}>
              {(control) => <TextInput {...control} {...nameField} autoComplete='off' />}
            </FormField>
            <DialogFooter>
              <Button isPending={isPending} type='submit'>
                {common('save')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
