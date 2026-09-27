import { Inject, Injectable } from '@nestjs/common';
import { mapValues } from 'remeda';

import type { LestaClients } from '../../../../core';
import type { LestaClient } from '../../../../lib/lesta';
import type { PollLestaPort } from '../lib/poll-pipeline';

import { LESTA_CLIENTS } from '../../../../core';
import { accountInfoSchema, tankStatsSchema } from '../../../../lib/lesta';
import { TRACKING } from '../config';

@Injectable()
export class TrackingLestaService {
  constructor(@Inject(LESTA_CLIENTS) private readonly clients: LestaClients) {}

  port(lane: keyof LestaClients): PollLestaPort {
    const client: LestaClient = this.clients[lane];

    return {
      accountInfo: async (accountIds) => {
        const infos = await client.account.info({ accountIds, extra: TRACKING.lesta.accountExtra, fields: TRACKING.lesta.accountFields });

        return mapValues(infos, (info) => (info ? accountInfoSchema.parse(info) : null));
      },
      accountTanks: (accountIds) => client.account.tanks({ accountIds }),
      tankStats: async ({ accountId, tankIds }) => {
        const stats = await client.tanks.stats({ accountId, tankIds, extra: TRACKING.lesta.tankExtra, fields: TRACKING.lesta.tankFields });

        return stats.map((row) => tankStatsSchema.parse(row));
      },
      tankMarks: async ({ accountId, tankIds }) => {
        const rows = await client.tanks.achievements({ accountId, tankIds, fields: TRACKING.lesta.marksFields });

        return new Map(
          rows.flatMap((row) => (row.tank_id === undefined ? [] : [[row.tank_id, row.achievements?.[TRACKING.lesta.marksAchievement] ?? 0]]))
        );
      }
    };
  }
}
