import type { WebhookEditorState } from '../../WebhooksPanel.types';

export type WebhookFormDialogProps = {
  editor: WebhookEditorState;
  onClose: () => void;
};
