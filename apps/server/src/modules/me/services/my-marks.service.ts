import type { PlayerMarks } from '@bronevik/schemas';

import { Injectable } from '@nestjs/common';

import { AppNotFoundException } from '../../../common/exceptions';
import { PrismaService } from '../../../core';
import { PlayerMarksService } from '../../players';

@Injectable()
export class MyMarksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly playerMarks: PlayerMarksService
  ) {}

  async marks(userId: string): Promise<PlayerMarks> {
    const link = await this.prisma.userLestaAccount.findFirst({
      where: { userId },
      orderBy: [{ isPrimary: 'desc' }, { linkedAt: 'asc' }],
      select: { accountId: true }
    });

    if (!link) {
      throw new AppNotFoundException('NOT_FOUND', 'Link a Lesta account to see your marks');
    }

    return this.playerMarks.marks(link.accountId);
  }
}
