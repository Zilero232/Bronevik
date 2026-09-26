'use client';

import type { WebhookEndpoint } from '@bronevik/schemas';

import { useState } from 'react';

import { removeWebhook } from '@/shared/api/developer';

import type { WebhookEditorState } from './use-webhooks-panel.types';

import { WEBHOOK_QUERIES } from '../../../config';
import { useDeveloperMutation } from '../use-developer-mutation';
import { useDeveloperOverview } from '../use-developer-overview';
import { useWebhooks } from '../use-webhooks';

export const useWebhooksPanel = () => {
  const { data: overview } = useDeveloperOverview();
  const { data: webhooks, isPending, isError, isFetching, refetch } = useWebhooks();
  const remove = useDeveloperMutation({ mutationFn: removeWebhook, invalidates: WEBHOOK_QUERIES.invalidates, successKey: 'webhookDeleted' });
  const [editor, setEditor] = useState<WebhookEditorState>({ mode: 'closed' });
  const [removing, setRemoving] = useState<WebhookEndpoint | null>(null);

  const isOverviewLoaded = overview !== undefined;
  const count = webhooks?.length ?? 0;
  const limit = overview?.limits.webhooks ?? 0;
  const isFull = count >= limit;

  const onRetry = () => void refetch();
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
    webhooks,
    count,
    limit,
    isOverviewLoaded,
    isFull,
    isPending,
    isError,
    isFetching,
    editor,
    removing,
    setRemoving,
    isRemoving: remove.isPending,
    onRetry,
    onCreate,
    onEdit,
    onCloseEditor,
    onRemove,
    onRemoveOpenChange
  };
};
