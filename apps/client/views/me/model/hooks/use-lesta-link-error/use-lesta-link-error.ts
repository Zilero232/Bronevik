'use client';

import { useSearchParams } from 'next/navigation';

import { LESTA_LINK } from '../../../config';
import { lestaLinkErrorKey } from '../../../lib/lesta-link-error';

export const useLestaLinkError = () => lestaLinkErrorKey(useSearchParams().get(LESTA_LINK.errorParam));
