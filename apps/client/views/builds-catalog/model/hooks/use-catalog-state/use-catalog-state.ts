'use client';

import { useQueryStates } from 'nuqs';

import { CATALOG_QUERY_PARSERS } from '../../../config';

export const useCatalogState = () => useQueryStates(CATALOG_QUERY_PARSERS, { history: 'replace' });
