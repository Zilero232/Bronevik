import { telegramWebLoginSchema } from '@otmetki/schemas';
import { match } from 'ts-pattern';

import type { WebLoginCodeState, WebLoginPhase, WebLoginPhaseInput } from './web-login.types';

export const webLoginCodeState = (code: string | null): WebLoginCodeState => {
  if (code === null || code === '') {
    return 'missing';
  }

  return telegramWebLoginSchema.safeParse({ code }).success ? 'valid' : 'invalid';
};

export const webLoginPhase = ({ codeState, status }: WebLoginPhaseInput): WebLoginPhase =>
  match({ codeState, status })
    .returnType<WebLoginPhase>()
    .with({ codeState: 'missing' }, () => 'missing')
    .with({ codeState: 'invalid' }, () => 'invalid')
    .with({ status: 'success' }, () => 'success')
    .with({ status: 'error' }, () => 'failed')
    .otherwise(() => 'redeeming');
