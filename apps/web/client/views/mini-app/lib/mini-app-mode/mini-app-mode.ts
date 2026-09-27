import { match, P } from 'ts-pattern';

import type { MiniAppMode, MiniAppModeInput } from './mini-app-mode.types';

export const resolveMiniAppMode = (input: MiniAppModeInput): MiniAppMode =>
  match(input)
    .returnType<MiniAppMode>()
    .with({ env: 'detecting' }, () => 'loading')
    .with({ env: 'inside', signInStatus: 'success' }, () => 'dashboard')
    .with({ env: 'inside', signInStatus: 'error' }, () => 'failed')
    .with({ env: 'inside' }, () => 'loading')
    .with({ hasSession: true }, () => 'preview')
    .with({ isSessionPending: true }, () => 'loading')
    .with({ env: P.any }, () => 'outside')
    .exhaustive();
