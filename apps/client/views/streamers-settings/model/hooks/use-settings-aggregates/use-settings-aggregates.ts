'use client';

import type { SettingsCohort } from '@otmetki/schemas';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { QUERY_KEYS } from '@/shared/constants';

import { getSettingsAggregates } from '../../../api';
import { STREAMERS_SETTINGS_PAGE } from '../../../config';
import { aggregateShares } from '../../../lib/aggregate-shares';

export const useSettingsAggregates = () => {
  const [cohort, setCohort] = useState<SettingsCohort>(STREAMERS_SETTINGS_PAGE.defaultCohort);
  const query = useQuery({
    queryKey: QUERY_KEYS.streamers.settingsAggregates(cohort),
    queryFn: () => getSettingsAggregates(cohort),
    placeholderData: keepPreviousData,
    select: ({ fields, ...rest }) => ({ ...rest, fields: fields.map((field) => ({ ...field, shares: aggregateShares(field) })) })
  });

  return {
    cohort,
    query,
    onCohortChange: setCohort
  };
};
