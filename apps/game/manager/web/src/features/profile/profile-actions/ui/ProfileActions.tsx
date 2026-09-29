import { Check, Copy, Pencil } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button, DeleteButton, IconButton, NameDialog } from '@/ui-kit';

import type { ProfileActionsProps } from './ProfileActions.types';

import { useProfileActions } from '../model/hooks';

import s from './ProfileActions.module.scss';

export const ProfileActions = ({ clientPath, profile }: ProfileActionsProps) => {
  const t = useTranslations('profiles');
  const common = useTranslations('common');
  const { isRenameOpen, setRenameOpen, renameField, renameError, isPending, onActivate, onDelete, onCopyCode, onRename } = useProfileActions({
    clientPath,
    profile
  });

  return (
    <div className={s.root}>
      <Button disabled={profile.active || isPending} size='sm' variant='secondary' onClick={onActivate}>
        <Check aria-hidden />
        {t('activate')}
      </Button>
      <IconButton disabled={isPending} label={t('export')} onClick={onCopyCode}>
        <Copy aria-hidden />
      </IconButton>
      <IconButton disabled={isPending} label={t('rename')} onClick={() => setRenameOpen(true)}>
        <Pencil aria-hidden />
      </IconButton>
      <DeleteButton
        cancelLabel={common('cancel')}
        description={t('deleteDescription')}
        disabled={isPending}
        label={common('delete')}
        title={t('deleteTitle', { name: profile.name })}
        onConfirm={onDelete}
      />
      <NameDialog
        error={renameError}
        field={renameField}
        isPending={isPending}
        label={t('name')}
        open={isRenameOpen}
        submitLabel={common('save')}
        title={t('renameTitle')}
        onOpenChange={setRenameOpen}
        onSubmit={onRename}
      />
    </div>
  );
};
