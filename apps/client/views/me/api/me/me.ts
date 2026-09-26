import type { BindCode, CreateGoalInput, Goal, ModDevice } from '@otmetki/schemas';
import { meControllerAddGoal, meControllerListGoals, meControllerRemoveGoal, modControllerIssueCode, modControllerList, modControllerRevoke } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

export const getGoals = (): Promise<Goal[]> => fromSdk(() => meControllerListGoals(SESSION_REQUEST));

export const addGoal = (input: CreateGoalInput): Promise<Goal> => fromSdk(() => meControllerAddGoal({ ...SESSION_REQUEST, body: input }));

export const removeGoal = async (id: string): Promise<void> => {
  await fromSdk(() => meControllerRemoveGoal({ ...SESSION_REQUEST, path: { id } }));
};

export const issueBindCode = (accountId?: number): Promise<BindCode> =>
  fromSdk(() => modControllerIssueCode({ ...SESSION_REQUEST, body: { accountId } }));

export const getModDevices = (): Promise<ModDevice[]> => fromSdk(() => modControllerList(SESSION_REQUEST));

export const revokeModDevice = async (id: string): Promise<void> => {
  await fromSdk(() => modControllerRevoke({ ...SESSION_REQUEST, path: { id } }));
};
