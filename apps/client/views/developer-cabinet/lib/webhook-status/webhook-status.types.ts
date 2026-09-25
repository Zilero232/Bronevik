import type { WebhookEndpoint } from '@bronevik/schemas';

export type WebhookStatus = 'active' | 'disabled' | 'paused';

export type WebhookStatusInput = Pick<WebhookEndpoint, 'disabledAt' | 'isActive'>;
