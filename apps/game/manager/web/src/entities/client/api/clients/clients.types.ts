import type { z } from 'zod';

import type { clientsViewSchema, gameClientSchema } from './clients.schemas';

export type GameClient = z.infer<typeof gameClientSchema>;

export type ClientsView = z.infer<typeof clientsViewSchema>;
