import type { InboxPage } from '@bronevik/schemas';

export type UseInboxPanelInput = {
  page?: InboxPage;
  onClose: () => void;
};
