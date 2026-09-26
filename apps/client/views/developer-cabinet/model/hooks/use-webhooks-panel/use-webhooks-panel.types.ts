import type { WebhookEndpoint } from '@otmetki/schemas';

export type WebhookEditorState = { mode: 'closed' } | { mode: 'create' } | { mode: 'edit'; endpoint: WebhookEndpoint };
