import { z } from 'zod';

export const serverOnlineSchema = z.looseObject({
  server: z.string(),
  players_online: z.number().int().nonnegative()
});

export const serversInfoSchema = z.record(z.string(), z.array(serverOnlineSchema));
