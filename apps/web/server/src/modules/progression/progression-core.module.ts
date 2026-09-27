import { Module } from '@nestjs/common';

import { BillingCoreModule } from '../billing';
import { CosmeticsService, ShellLedgerService } from './services';

@Module({
  imports: [BillingCoreModule],
  providers: [ShellLedgerService, CosmeticsService],
  exports: [ShellLedgerService, CosmeticsService]
})
export class ProgressionCoreModule {}
