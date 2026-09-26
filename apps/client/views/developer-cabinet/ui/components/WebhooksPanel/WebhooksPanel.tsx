'use client';

import { Plus, Webhook } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { Button, ConfirmDialog, EmptyState, ErrorState, SectionHeader, Skeleton } from '@/ui-kit';

import { useWebhooksPanel } from '../../../model/hooks';
import { WebhookFormDialog, WebhookRow } from './components';

import s from './WebhooksPanel.module.scss';

export const WebhooksPanel = () => {
  const t = useTranslations('developer.webhooks');
  const tDeveloper = useTranslations('developer');
  const {
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
    isRemoving,
    onRetry,
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
          <Button disabled={!isOverviewLoaded || isError || isFull} onClick={onCreate}>
            <Plus size={16} />
            {t('create')}
          </Button>
        }
        description={t('description')}
        title={t('title')}
      />
      {isOverviewLoaded && isFull && <p className={s.limit}>{t('limit', { count, max: limit })}</p>}
      {match({ isPending, isError, count })
        .with({ isPending: true }, () => <Skeleton height={160} shape='block' />)
        .with({ isError: true }, () => <ErrorState isRetrying={isFetching} onRetry={onRetry} />)
        .with({ count: 0 }, () => <EmptyState description={t('emptyHint')} icon={<Webhook size={22} />} title={t('empty')} />)
        .otherwise(() => (
          <ul className={s.list}>
            {webhooks?.map((endpoint) => (
              <WebhookRow key={endpoint.id} endpoint={endpoint} onDelete={setRemoving} onEdit={onEdit} />
            ))}
          </ul>
        ))}
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
