'use client';

import { useTranslations } from 'next-intl';

import { Button, buttonVariants, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/ui-kit';

import type { ConfirmDialogProps } from './ConfirmDialog.types';

export const ConfirmDialog = ({ open, title, description, confirmLabel, isPending, onConfirm, onOpenChange }: ConfirmDialogProps) => {
  const t = useTranslations('developer');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent role='alertdialog'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose className={buttonVariants({ variant: 'ghost' })}>{t('cancel')}</DialogClose>
          <Button disabled={isPending} variant='danger' onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
