import type { WebhookEndpoint } from '@otmetki/schemas';

export type WebhookStatus = 'active' | 'disabled' | 'paused';

export type WebhookStatusInput = Pick<WebhookEndpoint, 'disabledAt' | 'isActive'>;
