'use client';

import type { ConfirmDialogProps } from './ConfirmDialog.types';

import { Button } from '../../atoms';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../Dialog';

export const ConfirmDialog = ({
  title,
  description,
  confirmLabel,
  cancelLabel,
  tone = 'default',
  isPending = false,
  isConfirmDisabled = false,
  children,
  onConfirm,
  open,
  onOpenChange,
  trigger
}: ConfirmDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    {trigger && <DialogTrigger render={trigger} />}
    <DialogContent role='alertdialog'>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {description && <DialogDescription>{description}</DialogDescription>}
      </DialogHeader>
      {children}
      <DialogFooter>
        <DialogClose render={<Button variant='ghost'>{cancelLabel}</Button>} />
        <Button disabled={isPending || isConfirmDisabled} variant={tone === 'danger' ? 'danger' : 'primary'} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
