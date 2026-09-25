import type { TelegramLinkCode } from '@bronevik/schemas';

export type CodeRequestProps = {
  code: TelegramLinkCode | undefined;
  botUsername: string | null;
  issuedAt: number;
  isIssuing: boolean;
  onIssue: () => void;
};
