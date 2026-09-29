import type { MoeCurve } from '@otmetki/schemas';

import { Injectable } from '@nestjs/common';
import { MOE_CURVE } from '@otmetki/schemas';
import { subDays } from 'date-fns';

import type { CurvePointRow } from '../lib';

import { PrismaService } from '../../../core';
import { ThresholdsService, toMoeThreshold } from '../../reference';
import { MOE_CURVE_SQL } from '../config';
import { curvePoints, curveSteps } from '../lib';
import { moeCurveSql } from '../queries';

@Injectable()
export class MoeCurveService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly thresholds: ThresholdsService
  ) {}

  async curve(tankId: number): Promise<MoeCurve> {
    const [moe, rows] = await Promise.all([
      this.thresholds.moe(tankId),
      this.prisma.$queryRaw<CurvePointRow[]>(
        moeCurveSql({
          tankId,
          since: subDays(new Date(), MOE_CURVE.windowDays),
          steps: curveSteps(),
          band: MOE_CURVE.bandPercent,
          battleType: MOE_CURVE_SQL.randomBattleType
        })
      )
    ]);

    return {
      tankId,
      windowDays: MOE_CURVE.windowDays,
      bandPercent: MOE_CURVE.bandPercent,
      minPlayers: MOE_CURVE.minPlayers,
      thresholds: moe ? toMoeThreshold(moe) : null,
      points: curvePoints(rows)
    };
  }
}
