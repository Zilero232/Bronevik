import { match } from 'ts-pattern';

import type { PushStatus, PushStatusInput } from './push-status.types';

export const resolvePushStatus = (input: PushStatusInput): PushStatus =>
  match(input)
    .returnType<PushStatus>()
    .with({ isReady: false }, () => 'loading')
    .with({ isSupported: false }, () => 'unsupported')
    .with({ publicKey: undefined }, () => 'loading')
    .with({ publicKey: null }, () => 'unconfigured')
    .with({ isSubscribed: true }, () => 'subscribed')
    .with({ permission: 'denied' }, () => 'denied')
    .otherwise(() => 'idle');
