import type { TelegramLinkCode } from '@otmetki/schemas';

export type CodeTicketProps = {
  code: TelegramLinkCode;
  botUsername: string | null;
  issuedAt: number;
  isIssuing: boolean;
  onReissue: () => void;
};
