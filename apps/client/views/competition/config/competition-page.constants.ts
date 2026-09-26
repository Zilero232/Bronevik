import type { JoinFormValues } from '../lib/join-form/join-form.types';

export const COMPETITION_PAGE = {
  skeletonHeights: [72, 120, 320],
  dateFormat: { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' },
  scoreFormat: { maximumFractionDigits: 0 },
  weightFormat: { maximumFractionDigits: 2 },
  iconSize: 14
} as const;

export const JOIN_FORM = {
  newTeam: 'new'
} as const;

export const JOIN_FORM_DEFAULTS: JoinFormValues = {
  accountId: '',
  teamId: JOIN_FORM.newTeam,
  teamName: ''
};
