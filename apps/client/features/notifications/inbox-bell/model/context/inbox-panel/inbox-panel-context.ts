'use client';

import { createContext, use } from 'react';

import type { InboxPanelContextValue } from './inbox-panel-context.types';

export const InboxPanelContext = createContext<InboxPanelContextValue | null>(null);

export const useInboxPanelContext = () => {
  const context = use(InboxPanelContext);

  if (!context) {
    throw new Error('useInboxPanelContext must be used inside InboxPanelProvider');
  }

  return context;
};
