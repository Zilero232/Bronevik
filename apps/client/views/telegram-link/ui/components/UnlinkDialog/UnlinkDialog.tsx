'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { Unlink } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/ui-kit';

import { useUnlinkTelegram } from '../../../model/hooks';

export const UnlinkDialog = () => {
  const t = useTranslations('telegram.unlink');
  const unlink = useUnlinkTelegram();
  const [isOpen, toggleOpen] = useBoolean(false);

  const onConfirm = () => unlink.mutate(undefined, { onSuccess: () => toggleOpen(false) });

  return (
    <Dialog open={isOpen} onOpenChange={toggleOpen}>
      <DialogTrigger
        render={
          <Button variant='ghost'>
            <Unlink size={16} />
            {t('trigger')}
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant='ghost'>{t('cancel')}</Button>} />
          <Button disabled={unlink.isPending} variant='danger' onClick={onConfirm}>
            {t('confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
