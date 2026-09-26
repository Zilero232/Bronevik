import type { WebhookEditorState } from '../../../../../model/hooks';

export type WebhookFormDialogProps = {
  editor: WebhookEditorState;
  onClose: () => void;
};
