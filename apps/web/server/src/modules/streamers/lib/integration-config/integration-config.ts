import type { StreamerIntegration } from '../../../../../generated';
import type { StoredIntegrationConfig } from './integration-config.types';

import { PREDICTIONS } from '../../config';
import { storedIntegrationConfigSchema } from '../../dto';

export const readIntegrationConfig = (config: unknown): StoredIntegrationConfig => storedIntegrationConfigSchema.safeParse(config).data ?? {};

export const canPredict = (integration: Pick<StreamerIntegration, 'provider' | 'scope'>): boolean =>
  integration.provider === 'twitch' && (integration.scope ?? '').split(' ').includes(PREDICTIONS.scope);
