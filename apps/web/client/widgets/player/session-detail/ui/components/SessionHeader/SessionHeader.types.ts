import type { Session } from '@otmetki/schemas';

export type SessionHeaderProps = {
  session: Session;
  nickname: string;
  withShare: boolean;
};
