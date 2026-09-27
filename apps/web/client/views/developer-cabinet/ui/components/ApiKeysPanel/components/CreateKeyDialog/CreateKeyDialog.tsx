'use client';

import { useTranslations } from 'next-intl';

import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/ui-kit';

import type { CreateKeyDialogProps } from './CreateKeyDialog.types';

import { useCreateKeyDialog } from '../../../../../model/hooks';
import { SecretReveal } from '../../../SecretReveal';
import { CreateKeyForm } from '../CreateKeyForm';

export const CreateKeyDialog = ({ open, onOpenChange }: CreateKeyDialogProps) => {
  const t = useTranslations('developer.createKey');
  const { created, setCreated, onChange, onDone } = useCreateKeyDialog({ onOpenChange });

  return (
    <Dialog disablePointerDismissal={created !== null} open={open} onOpenChange={onChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{created ? t('secretTitle', { name: created.key.name }) : t('title')}</DialogTitle>
          <DialogDescription>{created ? t('secretDescription') : t('description')}</DialogDescription>
        </DialogHeader>
        {created ? (
          <>
            <SecretReveal kind='key' secret={created.secret} />
            <DialogFooter>
              <Button onClick={onDone}>{t('done')}</Button>
            </DialogFooter>
          </>
        ) : (
          <CreateKeyForm onCreated={setCreated} />
        )}
      </DialogContent>
    </Dialog>
  );
};
