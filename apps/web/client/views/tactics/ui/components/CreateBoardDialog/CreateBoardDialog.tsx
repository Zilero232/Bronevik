'use client';

import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { BoardSettingsDialog } from '@/features/community/tactic-board-settings';

import { useCreateBoardDialog } from '../../../model/hooks';

export const CreateBoardDialog = () => {
  const t = useTranslations('tactics.create');
  const { isOpen, onOpenChange, defaultValues, onSubmit } = useCreateBoardDialog();

  return (
    <BoardSettingsDialog
      trigger={
        <>
          <Plus size={15} />
          {t('open')}
        </>
      }
      defaultValues={defaultValues}
      description={t('description')}
      isOpen={isOpen}
      submitLabel={t('submit')}
      title={t('title')}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
    />
  );
};
