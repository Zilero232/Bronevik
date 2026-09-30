import type { UiStatus } from '../../../../shared/api/protocol';

import { ACCOUNT_STATES } from '../../config';

export const accountState = (status: UiStatus) => ACCOUNT_STATES[status.auth_failed ? 'authFailed' : status.bound ? 'bound' : 'unbound'];
