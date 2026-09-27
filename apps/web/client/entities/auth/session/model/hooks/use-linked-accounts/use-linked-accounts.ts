'use client';

import { useQuery } from '@tanstack/react-query';

import type { UseLinkedAccountsInput } from './use-linked-accounts.types';

import { sessionQueries } from '../../../api';

export const useLinkedAccounts = ({ enabled }: UseLinkedAccountsInput = {}) => useQuery({ ...sessionQueries.linkedAccounts(), enabled });
