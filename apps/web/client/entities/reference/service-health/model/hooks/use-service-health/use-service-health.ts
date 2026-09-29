'use client';

import { useQuery } from '@tanstack/react-query';

import { healthQuery } from '../../../api';
import { summarizeHealth } from '../../../lib/health-summary';

export const useServiceHealth = () => {
  const query = useQuery(healthQuery());

  return { query, summary: summarizeHealth({ health: query.data, isError: query.isError }) };
};
