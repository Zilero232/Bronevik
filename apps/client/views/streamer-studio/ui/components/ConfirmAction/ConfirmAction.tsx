'use client';

import { useBoolean } from '@siberiacancode/reactuse';
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

export const ConfirmAction = ({ triggerLabel, title, description, confirmLabel, icon, isPending = false, onConfirm }: ConfirmActionProps) => {
  const t = useTranslations('streamer.confirm');
  const [isOpen, setOpen] = useBoolean(false);

  const onConfirmClick = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(next) => setOpen(next)}>
      <DialogTrigger className={buttonVariants({ variant: 'ghost', size: 'sm' })} disabled={isPending}>
        {icon}
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
