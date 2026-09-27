import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/config';

import { listClients } from '../../../api';

export const useClients = () => useQuery({ queryKey: QUERY_KEYS.clients, queryFn: listClients });
