'use client';

import { useQuery } from '@tanstack/react-query';

import { modpackReleaseQueries } from '../../../api';

export const useModpackChangelog = (limit: number) => useQuery(modpackReleaseQueries.changelog(limit));
