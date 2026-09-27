import type { TelegramLinkCode } from '@otmetki/schemas';

export type CodeRequestProps = {
  code: TelegramLinkCode | undefined;
  botUsername: string | null;
  issuedAt: number;
  isIssuing: boolean;
  onIssue: () => void;
};
