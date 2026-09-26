import type { InboxPage } from '@otmetki/schemas';

export type UseInboxPanelInput = {
  page?: InboxPage;
  onClose: () => void;
};
