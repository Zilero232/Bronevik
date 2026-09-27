import { Check, Copy, Pencil, Trash2 } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button, ConfirmDialog, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, FormField, TextInput } from '@/ui-kit';

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
      <Button aria-label={t('export')} disabled={isPending} size='icon' title={t('export')} variant='ghost' onClick={onCopyCode}>
        <Copy aria-hidden />
      </Button>
      <Button aria-label={t('rename')} disabled={isPending} size='icon' title={t('rename')} variant='ghost' onClick={() => setRenameOpen(true)}>
        <Pencil aria-hidden />
      </Button>
      <ConfirmDialog
        trigger={
          <Button aria-label={common('delete')} disabled={isPending} size='icon' title={common('delete')} variant='ghost'>
            <Trash2 aria-hidden />
          </Button>
        }
        cancelLabel={common('cancel')}
        confirmLabel={common('delete')}
        description={t('deleteDescription')}
        title={t('deleteTitle', { name: profile.name })}
        tone='danger'
        onConfirm={onDelete}
      />
      <Dialog open={isRenameOpen} onOpenChange={setRenameOpen}>
        <DialogContent>
          <form className={s.form} onSubmit={onRename}>
            <DialogHeader>
              <DialogTitle>{t('renameTitle')}</DialogTitle>
            </DialogHeader>
            <FormField error={renameError} label={t('name')}>
              {(control) => <TextInput {...control} {...renameField} autoComplete='off' />}
            </FormField>
            <DialogFooter>
              <Button isPending={isPending} type='submit'>
                {common('save')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
