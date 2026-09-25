import type { NOTIFICATION_LOCALES } from '../../config/copy.config';
import type { Digest, ParsedNotification } from '../../contracts';

export type NotificationLocale = (typeof NOTIFICATION_LOCALES)[number];

type TemplateValues = Record<string, number | string>;

export type FillTemplateInput = {
  template: string;
  values: TemplateValues;
};

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

export type LinkInput = {
  webUrl: string;
  template: string;
  values: TemplateValues;
};
