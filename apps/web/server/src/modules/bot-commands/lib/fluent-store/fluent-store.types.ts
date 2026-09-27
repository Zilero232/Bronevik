import type { LocaleNegotiator } from '@grammyjs/i18n';
import type { Context } from 'grammy';

export type CreateFluentStoreInput<C extends Context> = {
  files: Readonly<Record<string, URL>>;
  localeNegotiator?: LocaleNegotiator<C>;
};
