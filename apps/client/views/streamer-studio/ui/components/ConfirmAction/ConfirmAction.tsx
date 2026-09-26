'use client';

import { useTranslations } from 'next-intl';

import {
  Button,
  buttonVariants,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/ui-kit';

import type { ConfirmActionProps } from './ConfirmAction.types';

import { useConfirmAction } from '../../../model/hooks';

export const ConfirmAction = ({ triggerLabel, title, description, confirmLabel, isPending = false, onConfirm }: ConfirmActionProps) => {
  const t = useTranslations('streamer.confirm');
  const { isOpen, onOpenChange, onConfirmClick } = useConfirmAction(onConfirm);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger className={buttonVariants({ variant: 'ghost', size: 'sm' })} disabled={isPending}>
        {triggerLabel}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose className={buttonVariants({ variant: 'ghost', size: 'sm' })}>{t('cancel')}</DialogClose>
          <Button size='sm' variant='danger' onClick={onConfirmClick}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
