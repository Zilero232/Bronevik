'use client';

import { useQuery } from '@tanstack/react-query';

import { streamerQueries } from '../../../api';

export const useStreamerPage = (slug: string) => useQuery(streamerQueries.profile(slug));
