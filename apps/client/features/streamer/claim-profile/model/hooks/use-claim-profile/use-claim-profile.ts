'use client';

import type { StreamerClaim } from '@otmetki/schemas';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { match, P } from 'ts-pattern';

import { useAuthSession } from '@/entities/auth/session';
import { getIntegrations } from '@/entities/streamer/streamer';
import { QUERY_KEYS } from '@/shared/constants';

import type { ClaimView, InstantClaimMethod } from './use-claim-profile.types';

import { getClaimStatus, startClaim, verifyClaim } from '../../../api';
import { CLAIM_PROFILE } from '../../../config';
import { claimFailure, claimStage } from '../../../lib/claim-state';

export const useClaimProfile = (slug: string) => {
  const t = useTranslations('streamersDirectory.claim');
  const queryClient = useQueryClient();
  const { data: session, isPending: isSessionPending } = useAuthSession();
  const status = useQuery({
    queryKey: QUERY_KEYS.streamers.claim(slug),
    queryFn: () => getClaimStatus(slug),
    enabled: Boolean(session),
    retry: false
  });

  const integrations = useQuery({ queryKey: QUERY_KEYS.me.streamer.integrations, queryFn: getIntegrations, enabled: Boolean(session) });

  const claim = status.data ?? null;
  const twitch = integrations.data?.find(({ provider }) => provider === CLAIM_PROFILE.twitchProvider) ?? null;

  const view: ClaimView = match({ isSessionPending, session, status })
    .with({ isSessionPending: true }, () => 'pending' as const)
    .with({ session: P.nullish }, () => 'signIn' as const)
    .with({ status: { isPending: true } }, () => 'pending' as const)
    .with({ status: { isError: true } }, ({ status: { error } }) => claimFailure(error))
    .otherwise(() => 'ready' as const);

  const settle = (next: StreamerClaim) => {
    queryClient.setQueryData(QUERY_KEYS.streamers.claim(slug), next);

    if (next.status === 'resolved') {
      toast.success(t('resolved.toast'));
    }
  };

  const start = useMutation({
    mutationFn: (method: InstantClaimMethod) => startClaim({ slug, method }),
    onSuccess: settle,
    onError: (_, method) => void toast.error(method === 'oauth' ? t('oauth.failed') : t('failed'))
  });

  const verify = useMutation({
    mutationFn: () => verifyClaim(slug),
    onSuccess: (next) => {
      settle(next);

      if (next.status !== 'resolved') {
        toast.info(t('code.notFound'));
      }
    },
    onError: () => void toast.error(t('failed'))
  });

  return {
    view,
    claim,
    stage: claimStage(claim),
    twitchLogin: twitch ? (twitch.login ?? twitch.externalId) : null,
    startingMethod: start.isPending ? start.variables : null,
    isVerifying: verify.isPending,
    isRetrying: status.isFetching,
    onOauth: () => start.mutate('oauth'),
    onCode: () => start.mutate('bio_code'),
    onVerify: () => verify.mutate(),
    retry: () => void status.refetch()
  };
};
