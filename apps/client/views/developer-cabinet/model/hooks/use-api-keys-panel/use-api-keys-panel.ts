'use client';

import type { ApiKey } from '@otmetki/schemas';

import { API_KEY } from '@otmetki/schemas';
import { useBoolean } from '@siberiacancode/reactuse';
import { useState } from 'react';

import { QUERY_KEYS } from '@/shared/constants';

import { revokeApiKey } from '../../../api';
import { useApiKeys } from '../use-api-keys';
import { useDeveloperMutation } from '../use-developer-mutation';

export const useApiKeysPanel = () => {
  const { data: keys, isPending, isError, isFetching, refetch } = useApiKeys();
  const revoke = useDeveloperMutation({ mutationFn: revokeApiKey, invalidates: [QUERY_KEYS.me.developer.keys], successKey: 'keyRevoked' });
  const [isCreating, toggleCreating] = useBoolean(false);
  const [revoking, setRevoking] = useState<ApiKey | null>(null);

  const count = keys?.length ?? 0;
  const isFull = count >= API_KEY.maxActivePerUser;

  const onRetry = () => void refetch();

  const onRevoke = () => {
    if (revoking) {
      revoke.mutate(revoking.id, { onSuccess: () => setRevoking(null) });
    }
  };

  const onRevokeOpenChange = (open: boolean) => {
    if (!open) {
      setRevoking(null);
    }
  };

  return {
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
    isRevoking: revoke.isPending,
    onRetry,
    onRevoke,
    onRevokeOpenChange
  };
};
