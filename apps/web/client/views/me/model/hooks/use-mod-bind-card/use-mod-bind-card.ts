'use client';

import { useMutation } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';

import { getModDevices, issueBindCode, revokeModDevice } from '../../../api';
import { MOD_BIND } from '../../../config';
import { useMeSection } from '../use-me-section';

export const useModBindCard = () => {
  const { data: devices, isError, isFetching, refetch } = useMeSection({ section: 'devices', fetcher: getModDevices });
  const issue = useMutation({
    mutationFn: () => issueBindCode(),
    meta: { errorKey: 'me.toast.failed', invalidates: [QUERY_KEYS.me.section('devices')] }
  });

  const revoke = useMutation({
    mutationFn: revokeModDevice,
    meta: { successKey: 'me.toast.deviceRevoked', errorKey: 'me.toast.failed', invalidates: [QUERY_KEYS.me.section('devices')] }
  });

  return {
    code: issue.data,
    steps: MOD_BIND.steps,
    devices: devices ?? [],
    isIssuing: issue.isPending,
    isError,
    isRetrying: isFetching,
    isRevoking: revoke.isPending,
    onIssue: () => issue.mutate(undefined),
    onRetry: () => void refetch(),
    onRevoke: (id: string) => revoke.mutate(id)
  };
};
