'use client';

import type { CreatedApiKey } from '@bronevik/schemas';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/ui-kit';

import type { CreateKeyDialogProps } from './CreateKeyDialog.types';

import { SecretReveal } from '../../../SecretReveal';
import { CreateKeyForm } from '../CreateKeyForm';

export const CreateKeyDialog = ({ open, onOpenChange }: CreateKeyDialogProps) => {
  const t = useTranslations('developer.createKey');
  const [created, setCreated] = useState<CreatedApiKey | null>(null);

  const onChange = (next: boolean) => {
    onOpenChange(next);

    if (!next) {
      setCreated(null);
    }
  };

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
              <Button onClick={() => onChange(false)}>{t('done')}</Button>
            </DialogFooter>
          </>
        ) : (
          <CreateKeyForm onCreated={setCreated} />
        )}
      </DialogContent>
    </Dialog>
  );
};
