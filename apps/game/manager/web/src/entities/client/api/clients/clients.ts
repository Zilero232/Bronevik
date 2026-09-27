import { invokeCommand } from '@/shared/api';
import { COMMANDS } from '@/shared/config';

import { clientsViewSchema } from './clients.schemas';

export const listClients = () => invokeCommand({ command: COMMANDS.listClients, schema: clientsViewSchema });

export const addClient = (path: string) => invokeCommand({ command: COMMANDS.addClient, schema: clientsViewSchema, args: { path } });

export const selectClient = (path: string) => invokeCommand({ command: COMMANDS.selectClient, schema: clientsViewSchema, args: { path } });
