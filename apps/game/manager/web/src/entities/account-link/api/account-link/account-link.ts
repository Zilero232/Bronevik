import { invokeCommand } from '@/shared/api';
import { COMMANDS } from '@/shared/config';

import { accountLinkSchema } from './account-link.schemas';

export const getAccountLink = () => invokeCommand({ command: COMMANDS.getAccountLink, schema: accountLinkSchema });

export const linkAccount = (code: string) => invokeCommand({ command: COMMANDS.linkAccount, schema: accountLinkSchema, args: { code } });

export const selectSyncAccount = (accountId: number) =>
  invokeCommand({ command: COMMANDS.selectSyncAccount, schema: accountLinkSchema, args: { accountId } });
