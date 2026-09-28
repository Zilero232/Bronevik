'use client';

import { useQuery } from '@tanstack/react-query';

import { playersControllerCareerOptions } from '@/shared/api/query-options';

import { CAREER } from '../../../config';
import { useProfileContext } from '../../context';

export const useCareerPanel = () => {
  const { accountId } = useProfileContext();
  const query = useQuery(playersControllerCareerOptions({ path: { id: accountId } }));
  const { data } = query;

  const records = CAREER.records.flatMap((key) => {
    const record = data?.records[key];

    return record ? [{ key, ...record }] : [];
  });

  const assist = data?.assist ?? null;
  const assistParts = CAREER.assist.flatMap((key) => (assist?.[key] === null || assist?.[key] === undefined ? [] : [{ key, value: assist[key] }]));

  return { query, records, assist, assistParts, logoutAt: data?.logoutAt ?? null, isEmpty: records.length === 0 && assist === null };
};
