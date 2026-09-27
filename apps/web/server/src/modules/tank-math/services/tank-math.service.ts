import { Injectable } from '@nestjs/common';

import type { TankMath } from '../tank-math.types';

import { AppBadRequestException } from '../../../common/exceptions';
import { BuildDataService, isCrewSkill } from '../../builds';
import { camoSkillRate, toTankMathConfig } from '../lib';

@Injectable()
export class TankMathService {
  constructor(private readonly data: BuildDataService) {}

  async inputs(tankId: number): Promise<TankMath> {
    const [vehicle, skills] = await Promise.all([this.data.vehicle(tankId), this.data.crewSkills()]);

    try {
      return {
        tankId,
        isWheeled: vehicle.isWheeled,
        camoSkillRate: camoSkillRate(skills.flatMap((row) => (isCrewSkill(row.data) ? [row.data] : []))),
        stock: toTankMathConfig({ vehicle, preset: 'stock' }),
        top: toTankMathConfig({ vehicle, preset: 'top' })
      };
    } catch (error) {
      throw new AppBadRequestException('VALIDATION_FAILED', error instanceof Error ? error.message : `Tank ${tankId} has no usable game data`);
    }
  }
}
