import type { WebhookEndpoint } from '@bronevik/schemas';

export type WebhookEditorState = { mode: 'closed' } | { mode: 'create' } | { mode: 'edit'; endpoint: WebhookEndpoint };
