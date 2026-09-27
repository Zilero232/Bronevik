import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';

import { CurrentUserId } from '../../common/decorators';
import { RequiresPlus } from '../billing';
import { AnalyticsExportDto, RawStatsExportDto } from './dto';
import { DataExportService } from './services';

@ApiTags('me')
@Controller('me/export')
export class DataExportController {
  constructor(private readonly exports: DataExportService) {}

  @Get('raw')
  @ZodResponse({ type: RawStatsExportDto })
  raw(@CurrentUserId() userId: string) {
    return this.exports.raw(userId);
  }

  @Get('analytics')
  @RequiresPlus('analyticsExport')
  @ZodResponse({ type: AnalyticsExportDto })
  analytics(@CurrentUserId() userId: string) {
    return this.exports.analytics(userId);
  }
}
