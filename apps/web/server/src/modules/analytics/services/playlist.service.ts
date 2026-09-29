import type { Playlist, PlaylistReason } from '@otmetki/schemas';

import { Injectable } from '@nestjs/common';
import { PLAYLIST, PLAYLIST_REASONS, vehicleTypeSchema } from '@otmetki/schemas';
import { differenceInCalendarDays } from 'date-fns';
import { millisecondsInDay } from 'date-fns/constants';

import type { PlaylistInput } from '../analytics.types';
import type { PlaylistCandidate } from '../lib';

import { percentOf } from '../../../common/lib';
import { PrismaService } from '../../../core';
import { EntitlementsService } from '../../billing';
import { MissionProgressService } from '../../missions';
import { PlayerMarksService } from '../../players';
import { VehicleCatalogService } from '../../reference';
import { buildPlaylist, dailyWindow } from '../lib';
import { FirstWinService } from './first-win.service';
import { OwnAccountService } from './own-account.service';

@Injectable()
export class PlaylistService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly catalog: VehicleCatalogService,
    private readonly accounts: OwnAccountService,
    private readonly firstWin: FirstWinService,
    private readonly marks: PlayerMarksService,
    private readonly missions: MissionProgressService,
    private readonly entitlements: EntitlementsService
  ) {}

  async playlist({ userId, account, seed }: PlaylistInput): Promise<Playlist> {
    const now = new Date();
    const { resetAt } = dailyWindow(now);
    const isExtended = await this.entitlements.isPlus(userId);
    const size = isExtended ? PLAYLIST.plusSize : PLAYLIST.freeSize;
    const daySeed = seed ?? Math.floor(resetAt.getTime() / millisecondsInDay);
    const accountId = await this.accounts.find({ userId, account });
    const base = { isExtended, size, seed: daySeed };

    if (accountId === null) {
      return { accountId: null, state: 'noLink', ...base, items: [] };
    }

    const tanks = await this.prisma.playerTank.findMany({ where: { accountId, inGarage: true } });

    if (tanks.length === 0) {
      return { accountId: Number(accountId), state: 'noGarage', ...base, items: [] };
    }

    const [marks, taken, missionClasses, catalog] = await Promise.all([
      this.marks.marks(accountId),
      this.firstWin.taken({ accountId, since: resetAt }),
      isExtended ? this.missionClasses(userId) : Promise.resolve(new Set<string>()),
      this.catalog.all()
    ]);

    const markOf = new Map(marks.items.map((item) => [item.vehicle.tankId, item]));

    const candidates: PlaylistCandidate[] = tanks.flatMap((tank) => {
      const vehicle = catalog.get(tank.tankId)?.summary;
      const mark = markOf.get(tank.tankId);

      return vehicle
        ? [
            {
              tankId: tank.tankId,
              tier: vehicle.tier,
              battles: tank.battles,
              winRate: percentOf({ value: tank.wins, by: tank.battles }),
              moePercent: mark?.moePercent ?? null,
              nextMarkPercent: mark?.nextMarkPercent ?? null,
              daysSinceBattle: tank.lastBattleAt ? differenceInCalendarDays(now, tank.lastBattleAt) : null,
              isFirstWinAvailable: !taken.has(tank.tankId),
              isMission: missionClasses.has(vehicle.type)
            }
          ]
        : [];
    });

    const reasons: readonly PlaylistReason[] = isExtended ? PLAYLIST_REASONS : PLAYLIST.freeReasons;

    return {
      accountId: Number(accountId),
      state: 'ready',
      ...base,
      items: buildPlaylist({ candidates, size, reasons, seed: daySeed }).flatMap(({ candidate, reasons: why }) => {
        const vehicle = catalog.get(candidate.tankId)?.summary;

        return vehicle
          ? [
              {
                vehicle,
                reasons: why,
                battles: candidate.battles,
                winRate: candidate.winRate,
                moePercent: candidate.moePercent,
                nextMarkPercent: candidate.nextMarkPercent,
                damageToNextMark: markOf.get(candidate.tankId)?.damageToNextMark ?? null,
                daysSinceBattle: candidate.daysSinceBattle,
                isFirstWinAvailable: candidate.isFirstWinAvailable
              }
            ]
          : [];
      })
    };
  }

  private async missionClasses(userId: string): Promise<Set<string>> {
    const next = await this.missions.next(userId);

    return new Set(next?.missions.flatMap((mission) => (vehicleTypeSchema.safeParse(mission.branchKey).success ? [mission.branchKey] : [])) ?? []);
  }
}
