import type { WebhookEditorState } from '../use-webhooks-panel';

export type UseWebhookFormDialogInput = {
  editor: WebhookEditorState;
  onClose: () => void;
};
