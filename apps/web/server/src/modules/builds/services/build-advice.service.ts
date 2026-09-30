import type { BuildAdvice } from '@otmetki/schemas';

import { Injectable } from '@nestjs/common';
import { BUILD_USAGE } from '@otmetki/schemas';

import { toBuildAdvice } from '../mappers';
import { BuildUsageService } from './build-usage.service';

@Injectable()
export class BuildAdviceService {
  constructor(private readonly usage: BuildUsageService) {}

  async advice(tankId: number): Promise<BuildAdvice> {
    const usage = await this.usage.usage({ tankId, mode: BUILD_USAGE.defaultMode, cohort: BUILD_USAGE.defaultCohort });

    return toBuildAdvice({ tankId, usage });
  }
}
