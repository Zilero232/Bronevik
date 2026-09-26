import type {
  ModReference,
  SettingsHistoryEntry,
  SettingsProvenance,
  SettingsTableRow,
  SettingsValues,
  StreamerSettings,
  StreamerSettingsView
} from '@otmetki/schemas';

import { Injectable } from '@nestjs/common';
import { changedGroups, settingsGroupKeySchema, streamerSettingsSchema, toSettingsValues, zoomMax } from '@otmetki/schemas';
import { indexBy, unique } from 'remeda';

import type { StreamerProfile } from '../../../../generated';
import type { SaveMySettingsInput, SaveSettingsRequest } from '../streamers.types';

import { AppNotFoundException } from '../../../common/exceptions';
import { toIso } from '../../../common/lib';
import { PrismaService } from '../../../core';
import { STREAMERS } from '../config';
import { StreamerProfileService } from './streamer-profile.service';

@Injectable()
export class StreamerSettingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly profiles: StreamerProfileService
  ) {}

  async bySlug(slug: string): Promise<StreamerSettingsView> {
    return this.view(await this.profiles.publicBySlug(slug));
  }

  async mine(userId: string): Promise<StreamerSettingsView> {
    const profile = await this.prisma.streamerProfile.findUnique({ where: { userId } });

    if (!profile) {
      throw new AppNotFoundException('NOT_FOUND', 'No streamer profile yet');
    }

    return this.view(profile);
  }

  async history(slug: string): Promise<SettingsHistoryEntry[]> {
    const profile = await this.profiles.publicBySlug(slug);
    const versions = await this.prisma.streamerSettingsVersion.findMany({
      where: { profileId: profile.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: { id: true, source: true, changedGroups: true, createdAt: true }
    });

    return versions.map((version) => ({
      id: version.id,
      source: version.source as SettingsHistoryEntry['source'],
      changedGroups: version.changedGroups.flatMap((group) => {
        const parsed = settingsGroupKeySchema.safeParse(group);

        return parsed.success ? [parsed.data] : [];
      }),
      createdAt: version.createdAt.toISOString()
    }));
  }

  async saveMine({ userId, ...input }: SaveMySettingsInput): Promise<StreamerSettingsView> {
    const profile = await this.prisma.streamerProfile.findUnique({ where: { userId } });

    if (!profile) {
      throw new AppNotFoundException('NOT_FOUND', 'No streamer profile yet');
    }

    await this.save({ ...input, userId, profileId: profile.id });

    return this.view(profile);
  }

  async save({ profileId, userId, source, values, sourceUrls }: SaveSettingsRequest): Promise<void> {
    const current = await this.prisma.streamerSettings.findUnique({ where: { profileId } });
    const previous = current ? streamerSettingsSchema.parse(current.data) : null;
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

    if (changed.length === 0 && current) {
      return;
    }

    await this.prisma.$transaction([
      this.prisma.streamerSettings.upsert({ where: { profileId }, create: { profileId, data }, update: { data } }),
      this.prisma.streamerSettingsVersion.create({ data: { profileId, data, source, changedGroups: changed, createdBy: userId } })
    ]);
  }

  async table(): Promise<SettingsTableRow[]> {
    const rows = await this.prisma.streamerSettings.findMany({
      where: { profile: { hiddenAt: null, ...(STREAMERS.editorialEnabled ? {} : { kind: 'claimed' }) } },
      include: { profile: { select: { slug: true, displayName: true, isLive: true } } },
      orderBy: { updatedAt: 'desc' }
    });

    const settings = rows.map((row) => ({ row, data: streamerSettingsSchema.safeParse(row.data) }));
    const refIds = unique(settings.flatMap(({ data }) => (data.success && data.data.mods?.modpackRef ? [data.data.mods.modpackRef] : [])));
    const refs = indexBy(await this.prisma.modReference.findMany({ where: { id: { in: refIds }, fairPlay: 'published' } }), (ref) => ref.id);

    return settings.flatMap(({ row, data }) => {
      if (!data.success) {
        return [];
      }

      const values = data.data;
      const modpackRef = values.mods?.modpackRef;

      return {
        slug: row.profile.slug,
        displayName: row.profile.displayName,
        isLive: row.profile.isLive,
        sniperSensitivity: values.controls?.sensitivity?.sniper ?? null,
        fov: values.camera?.fov ?? null,
        preset: values.display?.preset ?? null,
        zoomMax: zoomMax(values.zoom?.steps),
        modpack: modpackRef ? (refs[modpackRef]?.name ?? null) : null,
        modsKind: values.mods?.kind ?? null,
        gpu: values.hardware?.gpu ?? null,
        updatedAt: row.updatedAt.toISOString()
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
    const current = await this.prisma.streamerSettings.findUnique({ where: { profileId } });

    return current ? toSettingsValues(streamerSettingsSchema.parse(current.data)) : null;
  }

  private async view(profile: StreamerProfile): Promise<StreamerSettingsView> {
    const current = await this.prisma.streamerSettings.findUnique({ where: { profileId: profile.id } });
    const settings: StreamerSettings = current ? streamerSettingsSchema.parse(current.data) : {};
    const refIds = unique([
      ...(settings.mods?.modpackRef ? [settings.mods.modpackRef] : []),
      ...(settings.mods?.modRefs ?? []),
      ...(settings.sight?.sightModRef ? [settings.sight.sightModRef] : []),
      ...(settings.zoom?.zoomModRef ? [settings.zoom.zoomModRef] : [])
    ]);

    const refs = await this.prisma.modReference.findMany({ where: { id: { in: refIds }, fairPlay: 'published' } });

    return {
      slug: profile.slug,
      displayName: profile.displayName,
      kind: profile.kind,
      settings,
      modReferences: refs.map((ref) => ({
        id: ref.id,
        kind: ref.kind as ModReference['kind'],
        name: ref.name,
        author: ref.author,
        officialUrl: ref.officialUrl,
        onMost: ref.onMost,
        checkedAt: toIso(ref.checkedAt)
      })),
      updatedAt: toIso(current?.updatedAt)
    };
  }

  private provenanceOf(group: SettingsProvenance | undefined) {
    return group ? { source: group.source, sourceUrl: group.sourceUrl, checkedAt: group.checkedAt } : {};
  }
}
