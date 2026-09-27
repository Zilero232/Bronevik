'use client';

import { Download, LogIn, Trash2, TriangleAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button, ConfirmDialog, FormField, Input } from '@/ui-kit';

import { DELETE_ACCOUNT } from '../../../config';
import { useDeleteAccountForm } from '../../../model/hooks';
import { MeCard } from '../MeCard';

import s from './DeleteAccountCard.module.scss';

export const DeleteAccountCard = () => {
  const t = useTranslations('me.deleteAccount');
  const {
    form,
    nickname,
    isOpen,
    isPending,
    isConfirmDisabled,
    isReauthRequired,
    isReauthenticating,
    isExporting,
    onOpenChange,
    onConfirm,
    onExport,
    onReauthenticate
  } = useDeleteAccountForm();

  return (
    <MeCard description={t('description')} icon={<TriangleAlert size={18} />} title={t('title')} tone='danger'>
      <ul className={s.list}>
        <li>{t('removed')}</li>
        <li>{t('kept')}</li>
        <li>{t('billing')}</li>
      </ul>
      <div className={s.actions}>
        <Button disabled={isExporting} size='sm' variant='secondary' onClick={onExport}>
          <Download size={15} />
          {t('exportFirst')}
        </Button>
        <ConfirmDialog
          trigger={
            <Button size='sm' variant='danger'>
              <Trash2 size={15} />
              {t('open')}
            </Button>
          }
          cancelLabel={t('cancel')}
          confirmLabel={t('confirm')}
          description={t('dialogText')}
          isConfirmDisabled={isConfirmDisabled}
          isPending={isPending}
          open={isOpen}
          title={t('dialogTitle')}
          tone='danger'
          onConfirm={onConfirm}
          onOpenChange={onOpenChange}
        >
          <FormField htmlFor={DELETE_ACCOUNT.inputId} label={t('confirmLabel', { nickname })}>
            <Input autoComplete='off' id={DELETE_ACCOUNT.inputId} placeholder={nickname} spellCheck={false} {...form.register('confirmation')} />
          </FormField>
          {isReauthRequired && (
            <div className={s.reauth} role='alert'>
              <p>{t('reauth')}</p>
              <Button disabled={isReauthenticating} size='sm' variant='secondary' onClick={onReauthenticate}>
                <LogIn size={15} />
                {t('reauthAction')}
              </Button>
            </div>
          )}
        </ConfirmDialog>
      </div>
    </MeCard>
  );
};
