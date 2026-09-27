'use client';

import { useQuery } from '@tanstack/react-query';

import { clanQueries } from '../../../api';

export const useClanPage = (tag: string) => useQuery({ ...clanQueries.page(tag), retry: false });
