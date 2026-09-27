import type { ReactNode } from 'react';

export type InboxPanelContextValue = {
  close: () => void;
};

export type InboxPanelProviderProps = {
  value: InboxPanelContextValue;
  children: ReactNode;
};
