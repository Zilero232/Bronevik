import type { CoachContacts } from '@/entities/coaching/coach';

import { safeWebHref } from '@/shared/lib';

import type { CoachContactLink } from './coach-contacts.types';

import { COACH_CONTACT_KINDS } from '../../config';

export const coachContactLinks = (contacts: CoachContacts): CoachContactLink[] =>
  COACH_CONTACT_KINDS.flatMap((kind) => {
    const value = contacts[kind]?.trim();

    if (!value) {
      return [];
    }

    return [{ kind, value, href: kind === 'discord' ? null : (safeWebHref(value) ?? null) }];
  });
