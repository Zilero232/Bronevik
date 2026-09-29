import type { TranslationVariables } from '@grammyjs/i18n';

import type { Digest, ParsedNotification } from '../../config';
import type { NOTIFICATION_COPY } from '../../config/copy.constants';

export type NotificationLocale = (typeof NOTIFICATION_COPY.locales)[number];

type CopyValues = TranslationVariables;

export type RenderedNotification = {
  title: string;
  body: string;
  url: string;
};

export type RenderNotificationInput = {
  notification: ParsedNotification;
  locale: NotificationLocale;
  webUrl: string;
};

export type RenderDigestInput = {
  digest: Digest;
  locale: NotificationLocale;
  webUrl: string;
};

export type NotificationTextInput = {
  locale: NotificationLocale;
  key: string;
  values?: CopyValues;
};

export type NotificationMessage = {
  message: string;
  values: CopyValues;
  path: string;
};

export type LinkInput = {
  webUrl: string;
  path: string;
};
