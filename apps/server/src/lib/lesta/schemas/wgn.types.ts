import type { z } from 'zod';

import type { serverOnlineSchema, serversInfoSchema } from './wgn.schemas';

export type ServerOnline = z.infer<typeof serverOnlineSchema>;
export type ServersInfo = z.infer<typeof serversInfoSchema>;
