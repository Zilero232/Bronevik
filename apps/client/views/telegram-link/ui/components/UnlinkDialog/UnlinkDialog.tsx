'use client';

import { useTranslations } from 'next-intl';

import { Button, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/ui-kit';

import { useUnlinkDialog } from '../../../model/hooks';

export const UnlinkDialog = () => {
  const t = useTranslations('telegram.unlink');
  const { isOpen, onOpenChange, onConfirm, isPending } = useUnlinkDialog();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger render={<Button variant='ghost'>{t('trigger')}</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant='ghost'>{t('cancel')}</Button>} />
          <Button disabled={isPending} variant='danger' onClick={onConfirm}>
            {t('confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
