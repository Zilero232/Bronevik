import { BullModule } from '@nestjs/bullmq';

import { QUEUE } from '../../contracts';

export const collectorQueues = BullModule.registerQueue(...Object.values(QUEUE).map((name) => ({ name })));
