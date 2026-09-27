import type { LestaLinkErrorKey } from './lesta-link-error.types';

import { LESTA_LINK } from '../../config';

export const lestaLinkErrorKey = (code: string | null): LestaLinkErrorKey | null => {
  if (!code) {
    return null;
  }

  return LESTA_LINK.knownErrors.find((known) => known === code) ?? 'other';
};
