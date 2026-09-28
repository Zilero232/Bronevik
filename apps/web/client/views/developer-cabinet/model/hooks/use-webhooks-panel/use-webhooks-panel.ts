'use client';

import type { WebhookEndpoint } from '@otmetki/schemas';

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import type { WebhookEditorState } from './use-webhooks-panel.types';

import { removeWebhook } from '../../../api';
import { WEBHOOK_QUERIES } from '../../../config';
import { useDeveloperOverview } from '../use-developer-overview';
import { useWebhooks } from '../use-webhooks';

export const useWebhooksPanel = () => {
  const { data: overview } = useDeveloperOverview();
  const query = useWebhooks();
  const remove = useMutation({
    mutationFn: removeWebhook,
    meta: { successKey: 'developer.toast.webhookDeleted', errorKey: 'developer.toast.failed', invalidates: WEBHOOK_QUERIES.invalidates }
  });

  const [editor, setEditor] = useState<WebhookEditorState>({ mode: 'closed' });
  const [removing, setRemoving] = useState<WebhookEndpoint | null>(null);

  const isOverviewLoaded = overview !== undefined;
  const count = query.data?.length ?? 0;
  const limit = overview?.limits.webhooks ?? 0;
  const isFull = count >= limit;

  const onCreate = () => setEditor({ mode: 'create' });
  const onEdit = (endpoint: WebhookEndpoint) => setEditor({ mode: 'edit', endpoint });
  const onCloseEditor = () => setEditor({ mode: 'closed' });

  const onRemove = () => {
    if (removing) {
      remove.mutate(removing.id, { onSuccess: () => setRemoving(null) });
    }
  };

  const onRemoveOpenChange = (open: boolean) => {
    if (!open) {
      setRemoving(null);
    }
  };

  return {
    query,
    count,
    limit,
    isOverviewLoaded,
    isFull,
    editor,
    removing,
    setRemoving,
    isRemoving: remove.isPending,
    onCreate,
    onEdit,
    onCloseEditor,
    onRemove,
    onRemoveOpenChange
  };
};
