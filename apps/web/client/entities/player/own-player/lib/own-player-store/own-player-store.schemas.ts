import { playerSummarySchema } from '@otmetki/schemas';
import { z } from 'zod';

export const ownPlayerStateSchema = z.object({ player: playerSummarySchema.pick({ accountId: true, nickname: true }) });
