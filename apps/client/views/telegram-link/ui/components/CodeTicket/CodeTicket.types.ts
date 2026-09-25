import type { TelegramLinkCode } from '@bronevik/schemas';

export type CodeTicketProps = {
  code: TelegramLinkCode;
  botUsername: string | null;
  issuedAt: number;
  isIssuing: boolean;
  onReissue: () => void;
};
