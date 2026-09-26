'use client';

import { parseAsStringLiteral, useQueryState } from 'nuqs';

import { RECRUITING_BOARD, RECRUITING_KINDS } from '../../../config';

export const useRecruitingKind = () => {
  const [kind, setKind] = useQueryState(
    'kind',
    parseAsStringLiteral(RECRUITING_KINDS).withDefault(RECRUITING_BOARD.defaultKind).withOptions({ history: 'replace' })
  );

  return { kind, setKind };
};
