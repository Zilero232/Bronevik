import type { LestaClient, LoginCallbackResult } from '../../lesta';

export type LestaIdentity = {
  accountId: number;
  nickname: string;
  accessToken: string;
  expiresAt: Date;
};

export type LestaTokenCheck = {
  accountIds: number[];
  accessToken: string;
  fields: readonly string[];
};

export type LestaTokenInfo = {
  account_id?: number;
  nickname?: string;
  private?: unknown;
};

export type LestaTokenVerifier = {
  account: {
    info: (input: LestaTokenCheck) => Promise<Record<string, LestaTokenInfo | null>>;
  };
};

export type VerifyLestaLoginInput = {
  login: Extract<LoginCallbackResult, { status: 'ok' }>;
  lesta: LestaTokenVerifier;
};

export type LinkLestaAccountInput = LestaIdentity & {
  userId: string;
};

export type LestaAccountStore = {
  findUserId: (accountId: number) => Promise<string | null>;
  link: (input: LinkLestaAccountInput) => Promise<boolean>;
  revokeTokens: (userId: string) => Promise<void>;
  primaryAccountId: (userId: string) => Promise<number | null>;
};

export type LestaIdOptions = {
  isConnected: boolean;
  lesta: LestaClient;
  store: LestaAccountStore;
  apiUrl: string;
  webUrl: string;
};

export type LestaIdState = {
  callbackURL: string;
  errorCallbackURL: string | null;
  linkUserId: string | null;
};

export type SafeCallbackUrlInput = {
  requested: string | undefined;
  webUrl: string;
};

export type WithErrorInput = {
  url: string;
  code: string;
};
