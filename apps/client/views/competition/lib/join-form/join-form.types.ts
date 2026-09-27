import type { Competition } from '@otmetki/schemas';
import type { z } from 'zod';

import type { joinFormSchema } from './join-form.schemas';

export type JoinFormValues = z.input<typeof joinFormSchema>;

export type JoinFormOutput = z.output<typeof joinFormSchema>;

export type ToJoinInput = {
  values: JoinFormOutput;
  accountIds: readonly number[];
  inviteCode: string | null;
};

export type JoinState = 'closed' | 'full' | 'joined' | 'open';

export type JoinCompetitionView = Pick<Competition, 'maxTeamSize' | 'myTeamId' | 'standings' | 'status'>;

export type ChosenAccountInput = {
  value: string;
  accountIds: readonly number[];
};
