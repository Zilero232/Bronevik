import { Module } from '@nestjs/common';

import { AnalyticsCoreModule } from '../analytics';
import { HonestRngController } from './honest-rng.controller';
import { HonestRngService } from './services';

@Module({
  imports: [AnalyticsCoreModule],
  controllers: [HonestRngController],
  providers: [HonestRngService]
})
export class HonestRngModule {}
