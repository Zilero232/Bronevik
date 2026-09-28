'use client';

import type { ApiKey } from '@otmetki/schemas';

import { API_KEY } from '@otmetki/schemas';
import { useBoolean } from '@siberiacancode/reactuse';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import { QUERY_KEYS } from '@/shared/constants';

import { revokeApiKey } from '../../../api';
import { useApiKeys } from '../use-api-keys';

export const useApiKeysPanel = () => {
  const query = useApiKeys();
  const revoke = useMutation({
    mutationFn: revokeApiKey,
    meta: {
      successKey: 'developer.toast.keyRevoked',
      errorKey: 'developer.toast.failed',
      invalidates: [QUERY_KEYS.me.developer.overview, QUERY_KEYS.me.developer.keys]
    }
  });

  const [isCreating, toggleCreating] = useBoolean(false);
  const [revoking, setRevoking] = useState<ApiKey | null>(null);

  const isFull = (query.data?.length ?? 0) >= API_KEY.maxActivePerUser;

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
    query,
    isFull,
    canCreate: query.data !== undefined && !isFull,
    isCreating,
    toggleCreating,
    revoking,
    setRevoking,
    isRevoking: revoke.isPending,
    onRevoke,
    onRevokeOpenChange
  };
};
