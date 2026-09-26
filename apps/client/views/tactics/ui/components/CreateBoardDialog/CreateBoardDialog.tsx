'use client';

import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { BoardSettingsForm } from '@/features/community/tactic-board-settings';
import { buttonVariants, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/ui-kit';

import { useCreateBoardDialog } from '../../../model/hooks';

export const CreateBoardDialog = () => {
  const t = useTranslations('tactics.create');
  const { isOpen, onOpenChange, defaultValues, onSubmit } = useCreateBoardDialog();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger className={buttonVariants({ size: 'sm' })}>
        <Plus size={15} />
        {t('open')}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <BoardSettingsForm defaultValues={defaultValues} submitLabel={t('submit')} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
};
