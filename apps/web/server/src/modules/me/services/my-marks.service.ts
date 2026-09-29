import type { PlayerMarks } from '@otmetki/schemas';

import { Injectable } from '@nestjs/common';

import { UserLestaAccountsService } from '../../../core';
import { PlayerMarksService } from '../../players';

@Injectable()
export class MyMarksService {
  constructor(
    private readonly lestaAccounts: UserLestaAccountsService,
    private readonly playerMarks: PlayerMarksService
  ) {}

  async marks(userId: string): Promise<PlayerMarks> {
    const accountId = await this.lestaAccounts.requirePrimaryAccountId({ userId, message: 'Link a Lesta account to see your marks' });

    return this.playerMarks.marks(accountId);
  }
}
