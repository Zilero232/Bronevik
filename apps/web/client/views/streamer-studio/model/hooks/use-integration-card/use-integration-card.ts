'use client';

import { useFormatter } from 'next-intl';
import { match, P } from 'ts-pattern';

import type { UseIntegrationCardInput } from './use-integration-card.types';

import { INTEGRATION_BADGE } from '../../../config';
import { useConnectIntegration, useDisconnectIntegration } from '../use-integrations';

export const useIntegrationCard = ({ integration, path }: UseIntegrationCardInput) => {
  const format = useFormatter();
  const connect = useConnectIntegration();
  const disconnect = useDisconnectIntegration();

  const state = match({ integration, path })
    .with({ integration: P.nonNullable }, () => 'on' as const)
    .with({ path: P.nonNullable }, () => 'off' as const)
    .otherwise(() => 'soon' as const);

  const connectedAs = integration && {
    login: integration.login ?? integration.externalId,
    date: format.dateTime(new Date(integration.connectedAt), { dateStyle: 'medium' })
  };

  const onConnect = () => {
    if (path) {
      connect.mutate(path);
    }
  };

  const onDisconnect = () => {
    if (path) {
      disconnect.mutate(path);
    }
  };

  return {
    state,
    badge: INTEGRATION_BADGE[state],
    connectedAs,
    isConnecting: connect.isPending,
    isDisconnecting: disconnect.isPending,
    onConnect,
    onDisconnect
  };
};
