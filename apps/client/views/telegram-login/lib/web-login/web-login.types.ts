import type { MutationStatus } from '@tanstack/react-query';

export type WebLoginCodeState = 'invalid' | 'missing' | 'valid';

export type WebLoginPhase = 'confirm' | 'failed' | 'invalid' | 'missing' | 'redeeming' | 'success';

export type WebLoginPhaseInput = {
  codeState: WebLoginCodeState;
  status: MutationStatus;
};
