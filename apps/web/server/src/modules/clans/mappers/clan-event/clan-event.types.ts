import type { ClanMemberEvent } from '../../../../../generated';

export type ToClanEventInput = {
  row: ClanMemberEvent;
  nickname: string | null;
};
