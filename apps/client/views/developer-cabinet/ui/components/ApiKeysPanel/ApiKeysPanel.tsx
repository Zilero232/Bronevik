'use client';

import { API_KEY } from '@otmetki/schemas';
import { KeyRound, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button, ConfirmDialog, EmptyState, QueryState, SectionHeader, Skeleton } from '@/ui-kit';

import { useApiKeysPanel } from '../../../model/hooks';
import { ApiKeyRow, CreateKeyDialog } from './components';

import s from './ApiKeysPanel.module.scss';

export const ApiKeysPanel = () => {
  const t = useTranslations('developer.keys');
  const tDeveloper = useTranslations('developer');
  const { query, isFull, canCreate, isCreating, toggleCreating, revoking, setRevoking, isRevoking, onRevoke, onRevokeOpenChange } = useApiKeysPanel();

  return (
    <section className={s.root} id='keys'>
      <SectionHeader
        action={
          <Button disabled={!canCreate} onClick={() => toggleCreating(true)}>
            <Plus size={16} />
            {t('create')}
          </Button>
        }
        description={t('description', { max: API_KEY.maxActivePerUser })}
        title={t('title')}
      />
      {isFull && <p className={s.limit}>{t('limit', { max: API_KEY.maxActivePerUser })}</p>}
      <QueryState
        empty={<EmptyState description={t('emptyHint')} icon={<KeyRound size={22} />} title={t('empty')} />}
        query={query}
        skeleton={<Skeleton height={180} shape='block' />}
      >
        {(keys) => (
          <ul className={s.list}>
            {keys.map((apiKey) => (
              <ApiKeyRow key={apiKey.id} apiKey={apiKey} onRevoke={setRevoking} />
            ))}
          </ul>
        )}
      </QueryState>
      <CreateKeyDialog open={isCreating} onOpenChange={toggleCreating} />
      <ConfirmDialog
        cancelLabel={tDeveloper('cancel')}
        confirmLabel={t('revoke')}
        description={t('revokeText', { name: revoking?.name ?? '' })}
        isPending={isRevoking}
        open={revoking !== null}
        title={t('revokeTitle')}
        tone='danger'
        onConfirm={onRevoke}
        onOpenChange={onRevokeOpenChange}
      />
    </section>
  );
};
