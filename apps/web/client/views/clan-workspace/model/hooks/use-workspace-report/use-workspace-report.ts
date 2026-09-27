'use client';

import { useQuery } from '@tanstack/react-query';

import type { UseWorkspaceEventsInput } from '../use-workspace-events';

import { workspaceQueries } from '../../../api';

export const useWorkspaceReport = ({ clanId, isEnabled }: UseWorkspaceEventsInput) =>
  useQuery({ ...workspaceQueries.report(clanId), enabled: isEnabled, retry: false });
