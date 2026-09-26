'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
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

import type { GuideOwnerActionsProps } from './GuideOwnerActions.types';

import { useGuideDelete } from '../../../../../model/hooks';

export const GuideOwnerActions = ({ guide }: GuideOwnerActionsProps) => {
  const t = useTranslations('guides.detail');
  const { isOpen, onOpenChange, remove, isPending } = useGuideDelete(guide);

  return (
    <>
      <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={ROUTES.guides.edit(guide.slug)}>
        <Pencil size={14} />
        {t('edit')}
      </Link>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTrigger className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
          <Trash2 size={14} />
          {t('delete')}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('deleteTitle')}</DialogTitle>
            <DialogDescription>{t('deleteDescription')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose className={buttonVariants({ variant: 'ghost', size: 'sm' })}>{t('cancel')}</DialogClose>
            <Button disabled={isPending} size='sm' variant='danger' onClick={remove}>
              {t('delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
