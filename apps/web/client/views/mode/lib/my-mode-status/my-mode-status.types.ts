import type { MyModeLine } from '@otmetki/schemas';

export type MyModeStatus = 'empty' | 'error' | 'noAccount' | 'pending' | 'ready' | 'session' | 'signedOut';

export type MyModeStatusInput = {
  isSignedIn: boolean;
  isSessionPending: boolean;
  isPending: boolean;
  error: unknown;
  line: MyModeLine | null;
};

export type ShouldRetryMyModeInput = {
  failureCount: number;
  error: unknown;
};
