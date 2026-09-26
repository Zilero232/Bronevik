import { match, P } from 'ts-pattern';

import type { MiniAppMode, MiniAppModeInput } from './mini-app-mode.types';

export const resolveMiniAppMode = (input: MiniAppModeInput): MiniAppMode =>
  match(input)
    .returnType<MiniAppMode>()
    .with({ env: 'detecting' }, () => 'loading')
    .with({ env: 'telegram', signInStatus: 'success' }, () => 'dashboard')
    .with({ env: 'telegram', signInStatus: 'error' }, () => 'failed')
    .with({ env: 'telegram' }, () => 'loading')
    .with({ hasSession: true }, () => 'preview')
    .with({ isSessionPending: true }, () => 'loading')
    .with({ env: P.any }, () => 'outside')
    .exhaustive();
