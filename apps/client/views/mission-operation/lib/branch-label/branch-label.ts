import { isIncludedIn } from 'remeda';

import { BRANCH_KEYS } from '../../config';

export const knownBranch = (key: string): (typeof BRANCH_KEYS)[number] | null => (isIncludedIn(key, BRANCH_KEYS) ? key : null);
