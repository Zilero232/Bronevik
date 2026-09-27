import type { LESTA_LINK } from '../../config';

export type LestaLinkErrorKey = 'other' | (typeof LESTA_LINK.knownErrors)[number];
