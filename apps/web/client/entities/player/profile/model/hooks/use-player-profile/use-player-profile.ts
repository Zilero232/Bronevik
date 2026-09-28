'use client';

import { useQuery } from '@tanstack/react-query';

import { playerQueries } from '../../../api';

export const usePlayerProfile = (idOrNick: string) => useQuery(playerQueries.profile(idOrNick));
