import type { Graph, Thing, WithContext } from 'schema-dts';

import type { Locale } from '@/shared/i18n';

type JsonLdDocument = WithContext<Thing>;

export type JsonLdData = Graph | JsonLdDocument | readonly JsonLdDocument[];

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

export type ArticleJsonLdInput = {
  headline: string;
  description: string;
  path: string;
  locale: Locale;
  image?: string | null;
  datePublished?: string | null;
  dateModified: string;
  authorName?: string | null;
};
