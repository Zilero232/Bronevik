import { parseAsStringLiteral } from 'nuqs';

import type { BadgeTone } from '@/ui-kit';

import type { CandidateStatus } from '../api';

export const CANDIDATE_STATUSES = ['sourced', 'contacted', 'trial', 'accepted', 'rejected'] as const satisfies readonly CandidateStatus[];

export const CANDIDATE_FILTERS = ['all', ...CANDIDATE_STATUSES] as const;

export const CANDIDATE_FILTER_PARSER = parseAsStringLiteral(CANDIDATE_FILTERS).withDefault('all').withOptions({ history: 'replace' });

export const CANDIDATE_STATUS_TONES = {
  sourced: 'neutral',
  contacted: 'steel',
  trial: 'warning',
  accepted: 'success',
  rejected: 'danger'
} as const satisfies Record<CandidateStatus, BadgeTone>;

export const CANDIDATE_NOTES = {
  maxLength: 4000,
  rows: 5
} as const;

export const CANDIDATE_FORM_DEFAULTS = {
  notes: ''
} as const;
