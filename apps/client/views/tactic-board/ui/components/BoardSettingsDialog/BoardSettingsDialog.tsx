'use client';

import { Settings2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { BoardSettingsForm } from '@/features/community/tactic-board-settings';
import { buttonVariants, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/ui-kit';

import type { BoardSettingsDialogProps } from './BoardSettingsDialog.types';

import { useBoardSettingsDialog } from '../../../model/hooks';

export const BoardSettingsDialog = ({ board, token }: BoardSettingsDialogProps) => {
  const t = useTranslations('tactics.edit');
  const { isOpen, onOpenChange, defaultValues, onSubmit } = useBoardSettingsDialog({ board, token });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger className={buttonVariants({ size: 'sm', variant: 'secondary' })}>
        <Settings2 size={15} />
        {t('open')}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        {isOpen && <BoardSettingsForm defaultValues={defaultValues} submitLabel={t('submit')} onSubmit={onSubmit} />}
      </DialogContent>
    </Dialog>
  );
};
