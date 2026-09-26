'use client';

import { Settings2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { BoardSettingsDialog as SettingsDialog } from '@/features/community/tactic-board-settings';

import type { BoardSettingsDialogProps } from './BoardSettingsDialog.types';

import { useBoardSettingsDialog } from '../../../model/hooks';

export const BoardSettingsDialog = ({ board, token }: BoardSettingsDialogProps) => {
  const t = useTranslations('tactics.edit');
  const { isOpen, onOpenChange, defaultValues, onSubmit } = useBoardSettingsDialog({ board, token });

  return (
    <SettingsDialog
      trigger={
        <>
          <Settings2 size={15} />
          {t('open')}
        </>
      }
      defaultValues={defaultValues}
      description={t('description')}
      isOpen={isOpen}
      submitLabel={t('submit')}
      title={t('title')}
      triggerVariant='secondary'
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
    />
  );
};
