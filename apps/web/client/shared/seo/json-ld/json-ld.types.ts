import type { Locale } from '@/shared/i18n';

export type JsonLdCrumb = {
  name: string;
  path?: string;
};

export type BreadcrumbJsonLdInput = {
  items: readonly JsonLdCrumb[];
  locale: Locale;
};

export type EntityJsonLdInput = {
  name: string;
  path: string;
  locale: Locale;
  image?: string | null;
};

export type ItemListJsonLdInput = {
  name: string;
  path: string;
  items: readonly Required<JsonLdCrumb>[];
  locale: Locale;
};
