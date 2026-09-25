'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { match, P } from 'ts-pattern';

import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/ui-kit';

import type { WebhookFormDialogProps } from './WebhookFormDialog.types';

import { SecretReveal } from '../../../SecretReveal';
import { WebhookForm } from '../WebhookForm';

import s from './WebhookFormDialog.module.scss';

export const WebhookFormDialog = ({ editor, onClose }: WebhookFormDialogProps) => {
  const t = useTranslations('developer.webhookForm');
  const [secret, setSecret] = useState<string | null>(null);

  const phase = match({ secret, editor })
    .with({ secret: P.string }, () => 'secret' as const)
    .with({ editor: { mode: 'edit' } }, () => 'edit' as const)
    .otherwise(() => 'create' as const);

  const onOpenChange = (next: boolean) => {
    if (!next) {
      onClose();
      setSecret(null);
    }
  };

  return (
    <Dialog disablePointerDismissal={phase === 'secret'} open={editor.mode !== 'closed'} onOpenChange={onOpenChange}>
      <DialogContent className={s.content}>
        <DialogHeader>
          <DialogTitle>{t(`${phase}.title`)}</DialogTitle>
          <DialogDescription>{t(`${phase}.description`)}</DialogDescription>
        </DialogHeader>
        {match({ secret, editor })
          .with({ secret: P.string }, ({ secret: value }) => (
            <>
              <SecretReveal kind='webhook' secret={value} />
              <DialogFooter>
                <Button onClick={() => onOpenChange(false)}>{t('done')}</Button>
              </DialogFooter>
            </>
          ))
          .with({ editor: { mode: 'edit' } }, ({ editor: { endpoint } }) => (
            <WebhookForm key={endpoint.id} endpoint={endpoint} onCreated={setSecret} onSaved={() => onOpenChange(false)} />
          ))
          .otherwise(() => (
            <WebhookForm endpoint={null} onCreated={setSecret} onSaved={() => onOpenChange(false)} />
          ))}
      </DialogContent>
    </Dialog>
  );
};
