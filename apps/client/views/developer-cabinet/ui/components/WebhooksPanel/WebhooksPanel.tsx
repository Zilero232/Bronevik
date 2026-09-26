'use client';

import type { WebhookEndpoint } from '@bronevik/schemas';

import { Plus, Webhook } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { match } from 'ts-pattern';

import { removeWebhook } from '@/shared/api/developer';
import { QUERY_KEYS } from '@/shared/constants';
import { STAGGER_ITEM } from '@/shared/lib';
import { Button, EmptyState, ErrorState, SectionHeader, Skeleton } from '@/ui-kit';

import type { WebhookEditorState } from './WebhooksPanel.types';

import { useDeveloperMutation, useDeveloperOverview, useWebhooks } from '../../../model/hooks';
import { ConfirmDialog } from '../ConfirmDialog';
import { WebhookFormDialog, WebhookRow } from './components';

import s from './WebhooksPanel.module.scss';

export const WebhooksPanel = () => {
  const t = useTranslations('developer.webhooks');
  const { data: overview } = useDeveloperOverview();
  const { data: webhooks, isPending, isError, isFetching, refetch } = useWebhooks();
  const remove = useDeveloperMutation({ mutationFn: removeWebhook, invalidates: [QUERY_KEYS.me.developer.webhooks], successKey: 'webhookDeleted' });
  const [editor, setEditor] = useState<WebhookEditorState>({ mode: 'closed' });
  const [removing, setRemoving] = useState<WebhookEndpoint | null>(null);

  const count = webhooks?.length ?? 0;
  const limit = overview?.limits.webhooks ?? 0;
  const isFull = count >= limit;

  const onRemove = () => {
    if (removing) {
      remove.mutate(removing.id, { onSuccess: () => setRemoving(null) });
    }
  };

  return (
    <motion.section className={s.root} id='webhooks' variants={STAGGER_ITEM}>
      <SectionHeader
        action={
          <Button disabled={!overview || isError || isFull} onClick={() => setEditor({ mode: 'create' })}>
            <Plus size={16} />
            {t('create')}
          </Button>
        }
        description={t('description')}
        eyebrow={t('eyebrow')}
        index='03'
        title={t('title')}
      />
      {overview && isFull && <p className={s.limit}>{t('limit', { count, max: limit })}</p>}
      {match({ isPending, isError, count })
        .with({ isPending: true }, () => <Skeleton height={160} shape='block' />)
        .with({ isError: true }, () => <ErrorState isRetrying={isFetching} onRetry={() => void refetch()} />)
        .with({ count: 0 }, () => <EmptyState description={t('emptyHint')} icon={<Webhook size={22} />} title={t('empty')} />)
        .otherwise(() => (
          <ul className={s.list}>
            {webhooks?.map((endpoint) => (
              <WebhookRow
                key={endpoint.id}
                endpoint={endpoint}
                onDelete={setRemoving}
                onEdit={(item) => setEditor({ mode: 'edit', endpoint: item })}
              />
            ))}
          </ul>
        ))}
      <WebhookFormDialog editor={editor} onClose={() => setEditor({ mode: 'closed' })} />
      <ConfirmDialog
        confirmLabel={t('delete')}
        description={t('deleteText', { url: removing?.url ?? '' })}
        isPending={remove.isPending}
        open={removing !== null}
        title={t('deleteTitle')}
        onConfirm={onRemove}
        onOpenChange={(open) => !open && setRemoving(null)}
      />
    </motion.section>
  );
};
