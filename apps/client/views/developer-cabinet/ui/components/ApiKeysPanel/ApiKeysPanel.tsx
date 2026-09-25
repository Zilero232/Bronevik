'use client';

import type { ApiKey } from '@bronevik/schemas';

import { API_KEY } from '@bronevik/schemas';
import { useBoolean } from '@siberiacancode/reactuse';
import { KeyRound, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { match } from 'ts-pattern';

import { revokeApiKey } from '@/shared/api/developer';
import { QUERY_KEYS } from '@/shared/constants';
import { STAGGER_ITEM } from '@/shared/lib';
import { Button, EmptyState, SectionHeader, Skeleton } from '@/ui-kit';

import { useApiKeys, useDeveloperMutation } from '../../../model/hooks';
import { ConfirmDialog } from '../ConfirmDialog';
import { ApiKeyRow, CreateKeyDialog } from './components';

import s from './ApiKeysPanel.module.scss';

export const ApiKeysPanel = () => {
  const t = useTranslations('developer.keys');
  const { data: keys, isPending } = useApiKeys();
  const revoke = useDeveloperMutation({ mutationFn: revokeApiKey, invalidates: [QUERY_KEYS.me.developer.keys], successKey: 'keyRevoked' });
  const [isCreating, toggleCreating] = useBoolean(false);
  const [revoking, setRevoking] = useState<ApiKey | null>(null);

  const count = keys?.length ?? 0;
  const isFull = count >= API_KEY.maxActivePerUser;

  const onRevoke = () => {
    if (revoking) {
      revoke.mutate(revoking.id, { onSuccess: () => setRevoking(null) });
    }
  };

  return (
    <motion.section className={s.root} id='keys' variants={STAGGER_ITEM}>
      <SectionHeader
        action={
          <Button disabled={isPending || isFull} onClick={() => toggleCreating(true)}>
            <Plus size={16} />
            {t('create')}
          </Button>
        }
        description={t('description', { max: API_KEY.maxActivePerUser })}
        eyebrow={t('eyebrow')}
        index='01'
        title={t('title')}
      />
      {isFull && <p className={s.limit}>{t('limit', { max: API_KEY.maxActivePerUser })}</p>}
      {match({ isPending, count })
        .with({ isPending: true }, () => <Skeleton height={180} shape='block' />)
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
        isPending={revoke.isPending}
        open={revoking !== null}
        title={t('revokeTitle')}
        onConfirm={onRevoke}
        onOpenChange={(open) => !open && setRevoking(null)}
      />
    </motion.section>
  );
};
