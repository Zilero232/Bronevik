import type { StreamerIntegration } from '../../../../../generated';
import type { StreamerIntegrationView } from '../../streamers.types';

import { canPredict, readIntegrationConfig } from '../../lib';

export const toIntegrationView = (integration: StreamerIntegration): StreamerIntegrationView => {
  const config = readIntegrationConfig(integration.config);

  return {
    provider: integration.provider,
    externalId: integration.externalId,
    login: config.login ?? null,
    connectedAt: integration.createdAt.toISOString(),
    predictions: config.predictions === true,
    canPredict: canPredict(integration)
  };
};
