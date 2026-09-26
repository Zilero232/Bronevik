import type { NotificationSettings } from '@otmetki/schemas';

import type { INBOX_FEED } from '../config';

export type InboxFeedFilter = (typeof INBOX_FEED.filters)[number];

export type SettingsSectionProps = {
  settings: NotificationSettings;
  onPatch: (patch: Partial<NotificationSettings>) => void;
};
