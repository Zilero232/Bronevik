'use client';

import { getModDevices, issueBindCode, revokeModDevice } from '@/shared/api/me';

import { MOD_BIND } from '../../../config';
import { useMeMutation } from '../use-me-mutation';
import { useMeSection } from '../use-me-section';

export const useModBindCard = () => {
  const { data: devices, isError, isFetching, refetch } = useMeSection({ section: 'devices', fetcher: getModDevices });
  const issue = useMeMutation({ section: 'devices', mutationFn: () => issueBindCode() });
  const revoke = useMeMutation({ section: 'devices', mutationFn: revokeModDevice, successKey: 'deviceRevoked' });

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
