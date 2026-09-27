import type { SettingsHistoryEntry, SettingsProvenance, SettingsTableRow, SettingsValues, StreamerSettingsView } from '@otmetki/schemas';

import { Injectable } from '@nestjs/common';
import { changedGroups, settingsGroupKeySchema, streamerSettingsSchema, toSettingsValues, zoomMax } from '@otmetki/schemas';

import type { SaveMySettingsInput, SaveSettingsRequest } from '../streamers.types';

import { Prisma } from '../../../../generated';
import { AppNotFoundException } from '../../../common/exceptions';
import { PrismaService } from '../../../core';
import { SETTINGS_HISTORY, STREAMERS } from '../config';
import { toSettingsHistoryEntry, toSettingsView } from '../mappers';
import { StreamerProfileService } from './streamer-profile.service';

@Injectable()
export class StreamerSettingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly profiles: StreamerProfileService
  ) {}

  async bySlug(slug: string): Promise<StreamerSettingsView> {
    return toSettingsView(await this.profiles.publicBySlug(slug));
  }

  async mine(userId: string): Promise<StreamerSettingsView> {
    const profile = await this.prisma.streamerProfile.findUnique({ where: { userId } });

    if (!profile) {
      throw new AppNotFoundException('NOT_FOUND', 'No streamer profile yet');
    }

    return toSettingsView(profile);
  }

  async history(slug: string): Promise<SettingsHistoryEntry[]> {
    const profile = await this.profiles.publicBySlug(slug);
    const versions = await this.prisma.streamerSettingsVersion.findMany({
      where: { profileId: profile.id },
      orderBy: { createdAt: 'desc' },
      take: SETTINGS_HISTORY.limit,
      select: { id: true, source: true, changedGroups: true, createdAt: true }
    });

    return versions.map(toSettingsHistoryEntry);
  }

  async saveMine({ userId, ...input }: SaveMySettingsInput): Promise<StreamerSettingsView> {
    const profile = await this.prisma.streamerProfile.findUnique({ where: { userId } });

    if (!profile) {
      throw new AppNotFoundException('NOT_FOUND', 'No streamer profile yet');
    }

    await this.save({ ...input, userId, profileId: profile.id });

    return this.mine(userId);
  }

  async save({ profileId, userId, source, values, sourceUrls }: SaveSettingsRequest): Promise<void> {
    const current = await this.prisma.streamerProfile.findUniqueOrThrow({ where: { id: profileId }, select: { settings: true } });
    const previous = current.settings === null ? null : streamerSettingsSchema.parse(current.settings);
    const previousValues = previous ? toSettingsValues(previous) : null;
    const changed = changedGroups({ previous: previousValues, next: values });
    const checkedAt = new Date().toISOString();
    const next: Record<string, unknown> = {};

    for (const group of settingsGroupKeySchema.options) {
      const content = values[group];

      if (!content) {
        continue;
      }

      next[group] = changed.includes(group)
        ? { ...content, source, sourceUrl: sourceUrls?.[group] ?? null, checkedAt }
        : { ...content, ...this.provenanceOf(previous?.[group]) };
    }

    const data = streamerSettingsSchema.parse(next);

    if (changed.length === 0 && previous) {
      return;
    }

    await this.prisma.$transaction([
      this.prisma.streamerProfile.update({ where: { id: profileId }, data: { settings: data, settingsUpdatedAt: new Date() } }),
      this.prisma.streamerSettingsVersion.create({ data: { profileId, data, source, changedGroups: changed, createdBy: userId } })
    ]);
  }

  async table(): Promise<SettingsTableRow[]> {
    const rows = await this.prisma.streamerProfile.findMany({
      where: { hiddenAt: null, settings: { not: Prisma.DbNull }, ...(STREAMERS.editorialEnabled ? {} : { kind: 'claimed' }) },
      select: { slug: true, displayName: true, isLive: true, settings: true, settingsUpdatedAt: true },
      orderBy: { settingsUpdatedAt: { sort: 'desc', nulls: 'last' } }
    });

    return rows.flatMap((row) => {
      const parsed = streamerSettingsSchema.safeParse(row.settings);

      if (!parsed.success || !row.settingsUpdatedAt) {
        return [];
      }

      const values = parsed.data;

      return {
        slug: row.slug,
        displayName: row.displayName,
        isLive: row.isLive,
        sniperSensitivity: values.controls?.sensitivity?.sniper ?? null,
        fov: values.camera?.fov ?? null,
        preset: values.display?.preset ?? null,
        zoomMax: zoomMax(values.zoom?.steps),
        modsKind: values.mods?.kind ?? null,
        gpu: values.hardware?.gpu ?? null,
        updatedAt: row.settingsUpdatedAt.toISOString()
      };
    });
  }

  async compare(slugs: readonly string[]): Promise<StreamerSettingsView[]> {
    const views: StreamerSettingsView[] = [];

    for (const slug of slugs) {
      views.push(await this.bySlug(slug));
    }

    return views;
  }

  async valuesOf(profileId: string): Promise<SettingsValues | null> {
    const current = await this.prisma.streamerProfile.findUnique({ where: { id: profileId }, select: { settings: true } });

    return current?.settings ? toSettingsValues(streamerSettingsSchema.parse(current.settings)) : null;
  }

  private provenanceOf(group: SettingsProvenance | undefined) {
    return group ? { source: group.source, sourceUrl: group.sourceUrl, checkedAt: group.checkedAt } : {};
  }
}
