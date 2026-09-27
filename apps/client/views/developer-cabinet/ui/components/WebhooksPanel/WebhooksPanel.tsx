'use client';

import { Plus, Webhook } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button, ConfirmDialog, EmptyState, QueryState, SectionHeader, Skeleton } from '@/ui-kit';

import { useWebhooksPanel } from '../../../model/hooks';
import { WebhookFormDialog, WebhookRow } from './components';

import s from './WebhooksPanel.module.scss';

export const WebhooksPanel = () => {
  const t = useTranslations('developer.webhooks');
  const tDeveloper = useTranslations('developer');
  const {
    query,
    count,
    limit,
    isOverviewLoaded,
    isFull,
    editor,
    removing,
    setRemoving,
    isRemoving,
    onCreate,
    onEdit,
    onCloseEditor,
    onRemove,
    onRemoveOpenChange
  } = useWebhooksPanel();

  return (
    <section className={s.root} id='webhooks'>
      <SectionHeader
        action={
          <Button disabled={!isOverviewLoaded || query.isError || isFull} onClick={onCreate}>
            <Plus size={16} />
            {t('create')}
          </Button>
        }
        description={t('description')}
        title={t('title')}
      />
      {isOverviewLoaded && isFull && <p className={s.limit}>{t('limit', { count, max: limit })}</p>}
      <QueryState
        empty={<EmptyState description={t('emptyHint')} icon={<Webhook size={22} />} title={t('empty')} />}
        query={query}
        skeleton={<Skeleton height={160} shape='block' />}
      >
        {(webhooks) => (
          <ul className={s.list}>
            {webhooks.map((endpoint) => (
              <WebhookRow key={endpoint.id} endpoint={endpoint} onDelete={setRemoving} onEdit={onEdit} />
            ))}
          </ul>
        )}
      </QueryState>
      <WebhookFormDialog editor={editor} onClose={onCloseEditor} />
      <ConfirmDialog
        cancelLabel={tDeveloper('cancel')}
        confirmLabel={t('delete')}
        description={t('deleteText', { url: removing?.url ?? '' })}
        isPending={isRemoving}
        open={removing !== null}
        title={t('deleteTitle')}
        tone='danger'
        onConfirm={onRemove}
        onOpenChange={onRemoveOpenChange}
      />
    </section>
  );
};
