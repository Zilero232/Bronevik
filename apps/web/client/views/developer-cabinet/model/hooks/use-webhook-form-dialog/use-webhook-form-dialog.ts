'use client';

import { useState } from 'react';
import { match, P } from 'ts-pattern';

import type { UseWebhookFormDialogInput } from './use-webhook-form-dialog.types';

export const useWebhookFormDialog = ({ editor, onClose }: UseWebhookFormDialogInput) => {
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

  const onDone = () => onOpenChange(false);

  return { secret, setSecret, phase, onOpenChange, onDone };
};
