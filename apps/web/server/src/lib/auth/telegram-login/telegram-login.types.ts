import type { setSessionCookie } from 'better-auth/cookies';

export type WidgetPayload = Record<string, string>;

export type VerifyWidgetInput = {
  payload: WidgetPayload;
  botToken: string;
  now?: Date;
};

export type IsFreshInput = {
  authDate: string;
  now: Date;
};

export type TelegramIdentity = {
  telegramId: bigint;
  username: string | null;
  name: string;
  languageCode: string | null;
};

export type LinkTelegramInput = TelegramIdentity & {
  userId: string;
};

export type TelegramAccountStore = {
  findUserId: (telegramId: bigint) => Promise<string | null>;
  link: (input: LinkTelegramInput) => Promise<void>;
};

export type TelegramLoginOptions = {
  botToken: string;
  botUsername: string;
  store: TelegramAccountStore;
};

export type VerifyWebAppInput = {
  initData: string;
  botToken: string;
  maxAgeSeconds?: number;
};

export type SignInTelegramInput = {
  ctx: Parameters<typeof setSessionCookie>[0];
  identity: TelegramIdentity;
  store: TelegramAccountStore;
};
