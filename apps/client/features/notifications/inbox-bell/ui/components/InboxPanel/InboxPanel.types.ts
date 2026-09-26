import type { InboxPage } from '@otmetki/schemas';

export type InboxPanelProps = {
  page?: InboxPage;
  isPending: boolean;
  isError: boolean;
  isRetrying: boolean;
  onRetry: () => void;
  onClose: () => void;
};
