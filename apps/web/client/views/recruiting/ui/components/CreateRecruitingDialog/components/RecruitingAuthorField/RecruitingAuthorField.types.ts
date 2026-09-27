import type { ViewerClanMembership } from '../../../../../lib/clan-officer';

export type RecruitingAuthorFieldProps = {
  isClan: boolean;
  isClansPending: boolean;
  officers: ViewerClanMembership[];
};
