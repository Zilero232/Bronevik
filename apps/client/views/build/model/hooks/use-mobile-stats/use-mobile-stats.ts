'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { isNonNullish } from 'remeda';

import { BUILD_VIEW } from '../../../config';
import { useBuildStatGroups } from '../use-build-stat-groups';

export const useMobileStats = () => {
  const { groups } = useBuildStatGroups();
  const [isOpen, toggleOpen] = useBoolean(false);

  const rows = groups.flatMap((group) => group.rows);
  const summary = BUILD_VIEW.summaryKeys.map((key) => rows.find((row) => row.key === key)).filter(isNonNullish);

  const onToggle = () => toggleOpen();

  return { summary, isOpen, onToggle };
};
