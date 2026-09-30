import { Module } from '@nestjs/common';

import { ModReportsController } from './mod-reports.controller';
import { ModReportsService } from './services';

@Module({
  controllers: [ModReportsController],
  providers: [ModReportsService]
})
export class ModReportsModule {}
