import { REQUIREMENTS_FORM } from '@/features/community/stat-requirements';

import type { TournamentFormValues } from '../lib/tournament-form';

export const TOURNAMENT_FILTERS = ['all', 'registration', 'running', 'finished', 'cancelled'] as const;

export const TOURNAMENT_LIST = {
  pageSize: 20,
  defaultFilter: 'all',
  descriptionRows: 5,
  dateFormat: { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }
} as const;

export const TOURNAMENT_FORM_DEFAULTS: TournamentFormValues = {
  title: '',
  description: '',
  requirements: REQUIREMENTS_FORM.emptyValues,
  maxParticipants: '16',
  registrationEndsAt: '',
  startsAt: ''
};
