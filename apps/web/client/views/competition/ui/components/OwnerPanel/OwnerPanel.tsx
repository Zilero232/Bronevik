'use client';

import { useTranslations } from 'next-intl';

import { Button, Card, ConfirmDialog, CopyField } from '@/ui-kit';

import type { OwnerPanelProps } from './OwnerPanel.types';

import { useOwnerActions } from '../../../model/hooks';

import s from './OwnerPanel.module.scss';

export const OwnerPanel = ({ competition }: OwnerPanelProps) => {
  const t = useTranslations('competitions.owner');
  const { isOwner, inviteLink, isDeleting, onDelete } = useOwnerActions(competition);

  if (!isOwner) {
    return null;
  }

  return (
    <Card aria-label={t('title')} className={s.root} padding='sm' variant='well'>
      <span className={s.label}>{t('title')}</span>
      {inviteLink && <CopyField className={s.invite} label={t('invite')} value={inviteLink} />}
      <ConfirmDialog
        trigger={
          <Button disabled={isDeleting} size='sm' variant='danger'>
            {t('delete')}
          </Button>
        }
        cancelLabel={t('cancel')}
        confirmLabel={t('confirmDelete')}
        description={t('deleteDescription')}
        isPending={isDeleting}
        title={t('deleteTitle')}
        tone='danger'
        onConfirm={onDelete}
      />
      <p className={s.hint}>{inviteLink ? t('inviteHint') : t('hint')}</p>
    </Card>
  );
};
