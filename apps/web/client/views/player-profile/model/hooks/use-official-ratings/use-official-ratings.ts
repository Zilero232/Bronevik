'use client';

import type { OfficialRatingField } from '@otmetki/schemas';

import { useQuery } from '@tanstack/react-query';

import { playersControllerOfficialRatingsOptions } from '@/shared/api/query-options';

import { OFFICIAL_CARD } from '../../../config';
import { hasRecentHistory } from '../../../lib/has-recent-history';
import { useProfileContext } from '../../context';

const percentFields: ReadonlySet<OfficialRatingField> = new Set(OFFICIAL_CARD.percentFields);

export const useOfficialRatings = () => {
  const { accountId, profile } = useProfileContext();
  const isHistoryEmpty = !hasRecentHistory(profile.recent);

  const { data } = useQuery({ ...playersControllerOfficialRatingsOptions({ path: { id: accountId } }), enabled: isHistoryEmpty });

  const periods = (data?.periods ?? []).map(({ period, fields }) => ({
    period,
    cells: OFFICIAL_CARD.fields.flatMap((field) => {
      const entry = fields[field];

      return entry ? [{ field, isPercent: percentFields.has(field), ...entry }] : [];
    })
  }));

  return { periods, isVisible: isHistoryEmpty && periods.length > 0 };
};
