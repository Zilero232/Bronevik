import type { RequestFormValues } from '../lib/request-form';

export const COACH_CONTACT_KINDS = ['booking', 'telegram', 'vk', 'discord'] as const;

export const COACH_REQUEST = {
  noOffer: 'none',
  notesRows: 4
} as const;

export const REQUEST_FORM_DEFAULTS: RequestFormValues = {
  offerId: COACH_REQUEST.noOffer,
  replayId: '',
  notes: '',
  studentContact: ''
};
