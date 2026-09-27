'use client';

import type { InboxPanelProviderProps } from '../../../model/context';

import { InboxPanelContext } from '../../../model/context';

export const InboxPanelProvider = ({ value, children }: InboxPanelProviderProps) => <InboxPanelContext value={value}>{children}</InboxPanelContext>;
