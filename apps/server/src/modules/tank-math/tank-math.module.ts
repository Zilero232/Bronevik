import { Module } from '@nestjs/common';

import { BuildsModule } from '../builds';
import { TanksModule } from '../tanks';
import { TankMathService } from './services';
import { TankMathController } from './tank-math.controller';

@Module({
  imports: [BuildsModule, TanksModule],
  controllers: [TankMathController],
  providers: [TankMathService]
})
export class TankMathModule {}
