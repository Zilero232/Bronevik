import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/config';

import { getPatchReport } from '../../../api';

export const usePatchReport = () => useQuery({ queryKey: QUERY_KEYS.patchReport, queryFn: getPatchReport });
