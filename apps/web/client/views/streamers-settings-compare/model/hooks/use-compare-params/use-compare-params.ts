'use client';

import { useQueryStates } from 'nuqs';

import { COMPARE_SETTINGS_PARAMS } from '../../../config';
import { compareSlugs, slotValues } from '../../../lib/compare-slugs';

export const useCompareParams = () => {
  const [params, setParams] = useQueryStates(COMPARE_SETTINGS_PARAMS, { history: 'replace' });

  return {
    slugs: compareSlugs(params),
    isMine: params.me,
    setSlugs: (next: readonly string[]) => void setParams(slotValues(next)),
    onMineChange: (me: boolean) => void setParams({ me: me || null })
  };
};
