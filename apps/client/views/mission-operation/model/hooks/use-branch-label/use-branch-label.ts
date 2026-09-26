'use client';

import { useTranslations } from 'next-intl';

import { knownBranch } from '../../../lib/branch-label';

export const useBranchLabel = () => {
  const t = useTranslations('missions.branch');

  return (key: string): string => {
    const known = knownBranch(key);

    return known ? t(known) : key;
  };
};
