import type { InboxPage } from '@bronevik/schemas';

export type InboxPanelProps = {
  page?: InboxPage;
  isPending: boolean;
  isError: boolean;
  onClose: () => void;
};
