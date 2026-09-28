import type { IncomingHttpHeaders } from 'node:http';

export type ThrottleRequest = {
  headers: IncomingHttpHeaders;
  ip?: string;
  socket: { remoteAddress?: string };
};

export type ThrottleSubjectPolicy = {
  token: string;
  trustedProxies: readonly string[];
};

export type ThrottleSubjectInput = {
  request: ThrottleRequest;
  policy: ThrottleSubjectPolicy;
};

export type ThrottleSubject = {
  tracker: string;
  isInternal: boolean;
};

export type TrustedPeerInput = {
  peer: string | undefined;
  trustedProxies: readonly string[];
};

export type InternalTokenInput = {
  received: string | undefined;
  token: string;
};
