import type { EnrolPayload, EnrolPriority } from '../contracts';

export type EnrolInput = EnrolPayload & {
  priority?: EnrolPriority;
};

export type EnrolManyInput = Omit<EnrolInput, 'accountId'> & {
  accountIds: readonly number[];
};

export type PollInput = {
  accountIds: readonly number[];
};
