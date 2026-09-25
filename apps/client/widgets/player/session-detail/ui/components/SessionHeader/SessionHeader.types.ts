import type { Session } from '@bronevik/schemas';

export type SessionHeaderProps = {
  session: Session;
  nickname: string;
  withShare: boolean;
};
