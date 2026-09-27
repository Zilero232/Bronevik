'use client';

import { useQuery } from '@tanstack/react-query';

import { mapQueries } from '../../../api';

export const useMapDetail = (idOrSlug: string) => useQuery({ ...mapQueries.detail(idOrSlug), retry: false });
