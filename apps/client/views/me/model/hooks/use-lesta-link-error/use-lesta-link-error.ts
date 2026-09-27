'use client';

import { useQueryState } from 'nuqs';

import { LESTA_LINK } from '../../../config';
import { lestaLinkErrorKey } from '../../../lib/lesta-link-error';

export const useLestaLinkError = () => lestaLinkErrorKey(useQueryState(LESTA_LINK.errorParam)[0]);
