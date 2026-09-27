'use client';

import { SHOWCASE } from '../../../config';
import { crewColumns } from '../../../lib/showcase';
import { useShowcaseSource } from '../use-showcase-source';
import { useShowcaseUsage } from '../use-showcase-usage';

export const useShowcaseCrew = () => {
  const { isShares } = useShowcaseSource();
  const usage = useShowcaseUsage();

  return { columns: usage ? crewColumns({ usage, limit: SHOWCASE.skillsPerRole }) : [], isShares };
};
