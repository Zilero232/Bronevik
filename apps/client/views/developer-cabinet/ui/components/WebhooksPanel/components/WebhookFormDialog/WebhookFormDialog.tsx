'use client';

import { useTranslations } from 'next-intl';
import { match, P } from 'ts-pattern';

import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/ui-kit';

import type { WebhookFormDialogProps } from './WebhookFormDialog.types';

import { useWebhookFormDialog } from '../../../../../model/hooks';
import { SecretReveal } from '../../../SecretReveal';
import { WebhookForm } from '../WebhookForm';

import s from './WebhookFormDialog.module.scss';

export const WebhookFormDialog = ({ editor, onClose }: WebhookFormDialogProps) => {
  const t = useTranslations('developer.webhookForm');
  const { secret, setSecret, phase, onOpenChange, onDone } = useWebhookFormDialog({ editor, onClose });

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
                <Button onClick={onDone}>{t('done')}</Button>
              </DialogFooter>
            </>
          ))
          .with({ editor: { mode: 'edit' } }, ({ editor: { endpoint } }) => (
            <WebhookForm key={endpoint.id} endpoint={endpoint} onCreated={setSecret} onSaved={onDone} />
          ))
          .otherwise(() => (
            <WebhookForm endpoint={null} onCreated={setSecret} onSaved={onDone} />
          ))}
      </DialogContent>
    </Dialog>
  );
};
