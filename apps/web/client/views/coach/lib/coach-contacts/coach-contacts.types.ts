import type { COACH_CONTACT_KINDS } from '../../config';

type CoachContactKind = (typeof COACH_CONTACT_KINDS)[number];

export type CoachContactLink = {
  kind: CoachContactKind;
  value: string;
  href: string | null;
};
