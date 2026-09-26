import type { ReplayStatus } from '@/shared/api/replays';

import type { ReplayFileProblem, ValidateReplayFileInput } from './upload-validation.types';

import { SETTLED_REPLAY_STATUSES } from '../../config';

const SETTLED_STATUSES = new Set<ReplayStatus>(SETTLED_REPLAY_STATUSES);

export const validateReplayFile = ({ file, rules }: ValidateReplayFileInput): ReplayFileProblem | null => {
  const name = file.name.toLowerCase();

  if (!rules.extensions.some((extension) => name.endsWith(extension.toLowerCase()))) {
    return 'extension';
  }

  if (file.size <= 0) {
    return 'empty';
  }

  return file.size > rules.maxBytes ? 'size' : null;
};

export const isSettledStatus = (status: ReplayStatus | undefined): boolean => status !== undefined && SETTLED_STATUSES.has(status);
