'use client';

import { useQueryState } from 'nuqs';

import { LOGIN } from '../../../config';

export const useLoginError = () => useQueryState(LOGIN.errorParam)[0];
