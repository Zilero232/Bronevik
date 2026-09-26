'use client';

import { API_KEY } from '@otmetki/schemas';
import { KeyRound, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { Button, EmptyState, ErrorState, SectionHeader, Skeleton } from '@/ui-kit';

import { useApiKeysPanel } from '../../../model/hooks';
import { ConfirmDialog } from '../ConfirmDialog';
import { ApiKeyRow, CreateKeyDialog } from './components';

import s from './ApiKeysPanel.module.scss';

export const ApiKeysPanel = () => {
  const t = useTranslations('developer.keys');
  const {
    keys,
    count,
    isPending,
    isError,
    isFetching,
    isFull,
    isCreating,
    toggleCreating,
    revoking,
    setRevoking,
    isRevoking,
    onRetry,
    onRevoke,
    onRevokeOpenChange
  } = useApiKeysPanel();

  return (
    <section className={s.root} id='keys'>
      <SectionHeader
        action={
          <Button disabled={isPending || isError || isFull} onClick={() => toggleCreating(true)}>
            <Plus size={16} />
            {t('create')}
          </Button>
        }
        description={t('description', { max: API_KEY.maxActivePerUser })}
        title={t('title')}
      />
      {isFull && <p className={s.limit}>{t('limit', { max: API_KEY.maxActivePerUser })}</p>}
      {match({ isPending, isError, count })
        .with({ isPending: true }, () => <Skeleton height={180} shape='block' />)
        .with({ isError: true }, () => <ErrorState isRetrying={isFetching} onRetry={onRetry} />)
        .with({ count: 0 }, () => <EmptyState description={t('emptyHint')} icon={<KeyRound size={22} />} title={t('empty')} />)
        .otherwise(() => (
          <ul className={s.list}>
            {keys?.map((apiKey) => (
              <ApiKeyRow key={apiKey.id} apiKey={apiKey} onRevoke={setRevoking} />
            ))}
          </ul>
        ))}
      <CreateKeyDialog open={isCreating} onOpenChange={toggleCreating} />
      <ConfirmDialog
        confirmLabel={t('revoke')}
        description={t('revokeText', { name: revoking?.name ?? '' })}
        isPending={isRevoking}
        open={revoking !== null}
        title={t('revokeTitle')}
        onConfirm={onRevoke}
        onOpenChange={onRevokeOpenChange}
      />
    </section>
  );
};
