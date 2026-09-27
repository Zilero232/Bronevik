'use client';

import { useTranslations } from 'next-intl';

import { Button, buttonVariants, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/ui-kit';

import type { DeleteBoardDialogProps } from './DeleteBoardDialog.types';

export const DeleteBoardDialog = ({ open, title, isPending, onConfirm, onOpenChange }: DeleteBoardDialogProps) => {
  const t = useTranslations('tactics.list');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent role='alertdialog'>
        <DialogHeader>
          <DialogTitle>{t('deleteTitle')}</DialogTitle>
          <DialogDescription>{t('deleteText', { title })}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose className={buttonVariants({ variant: 'ghost', size: 'sm' })}>{t('cancel')}</DialogClose>
          <Button disabled={isPending} size='sm' variant='danger' onClick={onConfirm}>
            {t('delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
