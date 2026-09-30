'use client';

import { useStoredStore } from '@/shared/lib';

import { compareStore } from '../../../lib/compare-store';

export const useCompareSelection = () => useStoredStore(compareStore);
