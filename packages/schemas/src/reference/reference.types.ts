import type { z } from 'zod';

import type { gameVersionSchema, serverOnlineSchema, serversOnlineSchema } from './reference.schemas';

export type GameVersion = z.infer<typeof gameVersionSchema>;
export type ServerOnline = z.infer<typeof serverOnlineSchema>;
export type ServersOnline = z.infer<typeof serversOnlineSchema>;
