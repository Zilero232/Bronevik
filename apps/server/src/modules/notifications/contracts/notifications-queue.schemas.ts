import { z } from 'zod';

import { NotificationChannel } from '../../../../generated';

const accountId = z.number().int().positive();
const tankId = z.number().int().positive();
const mark = z.number().int().min(1).max(3);

const notificationChannelDbSchema = z.enum(NotificationChannel);

export const notificationSchema = z.discriminatedUnion('event', [
  z.object({
    event: z.literal('moeGained'),
    accountId,
    nickname: z.string(),
    tankId,
    tankName: z.string(),
    marks: mark,
    isFollowed: z.boolean().default(false)
  }),
  z.object({
    event: z.literal('moeThresholdDropped'),
    tankId,
    tankName: z.string(),
    mark,
    from: z.number().int().nonnegative(),
    to: z.number().int().nonnegative()
  }),
  z.object({
    event: z.literal('sessionFinished'),
    accountId,
    nickname: z.string(),
    sessionId: z.string(),
    battles: z.number().int().positive(),
    winRate: z.number().min(0).max(1),
    avgDamage: z.number().nonnegative(),
    wn8: z.number().nullable()
  }),
  z.object({
    event: z.literal('bonusCode'),
    code: z.string().min(1),
    description: z.string().nullable()
  }),
  z.object({
    event: z.literal('premiumOffer'),
    tankId,
    tankName: z.string(),
    discountPercent: z.number().int().min(1).max(100).nullable()
  }),
  z.object({
    event: z.literal('challengeResolved'),
    challengeId: z.string(),
    title: z.string(),
    isSucceeded: z.boolean()
  }),
  z.object({
    event: z.literal('clanEventReminder'),
    clanId: z.number().int().positive(),
    clanTag: z.string(),
    title: z.string(),
    startsAt: z.string().nullable()
  }),
  z.object({
    event: z.literal('clanWeeklyReport'),
    clanId: z.number().int().positive(),
    clanTag: z.string(),
    from: z.string(),
    report: z.object({
      events: z.number().int().nonnegative(),
      attendanceRate: z.number().min(0).max(1).nullable(),
      newCandidates: z.number().int().nonnegative(),
      inactiveMembers: z.number().int().nonnegative()
    })
  }),
  z.object({
    event: z.literal('badgeAwarded'),
    accountId,
    badgeCode: z.string().min(1),
    title: z.string()
  })
]);

export const deliverPayloadSchema = z.object({
  userId: z.string().min(1),
  dedupeKey: z.string().min(1).max(200),
  notification: notificationSchema,
  onlyChannels: z.array(notificationChannelDbSchema).optional()
});

export const digestSchema = z.object({
  battles: z.number().int().nonnegative(),
  wins: z.number().int().nonnegative(),
  damageDealt: z.number().int().nonnegative(),
  sessions: z.number().int().nonnegative(),
  marksGained: z.number().int().nonnegative()
});

export const digestPayloadSchema = z.object({
  userId: z.string().min(1),
  weekKey: z.string().min(1),
  digest: digestSchema
});
