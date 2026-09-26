import { match } from 'ts-pattern';

import type {
  LinkInput,
  NotificationLocale,
  NotificationMessage,
  NotificationTextInput,
  RenderDigestInput,
  RenderedNotification,
  RenderNotificationInput
} from './notification-copy.types';

import { createFluentStore } from '../../../telegram';
import { NOTIFICATION_COPY, NOTIFICATION_LINKS } from '../../config/copy.config';

const store = createFluentStore({ files: NOTIFICATION_COPY.files });

const link = ({ webUrl, path }: LinkInput): string => new URL(path, webUrl).href;

const playerPath = (nickname: string): string => `${NOTIFICATION_LINKS.player}/${encodeURIComponent(nickname)}`;

const clanWorkspacePath = (clanId: number): string => `${NOTIFICATION_LINKS.clans}/${clanId}/${NOTIFICATION_LINKS.clanWorkspace}`;

export const resolveNotificationLocale = (raw: string | null | undefined): NotificationLocale =>
  NOTIFICATION_COPY.locales.find((locale) => raw?.toLowerCase().startsWith(locale)) ?? NOTIFICATION_COPY.fallbackLocale;

export const notificationText = ({ locale, key, values }: NotificationTextInput): string => store.t(locale, key, values);

const messageOf = (notification: RenderNotificationInput['notification']): NotificationMessage =>
  match(notification)
    .with({ event: 'moeGained' }, (event) => ({
      message: event.isFollowed ? 'moe-gained-followed' : 'moe-gained',
      values: { nickname: event.nickname, marks: event.marks, tankName: event.tankName },
      path: playerPath(event.nickname)
    }))
    .with({ event: 'moeThresholdDropped' }, (event) => ({
      message: 'moe-threshold-dropped',
      values: { tankName: event.tankName, mark: event.mark, from: event.from, to: event.to },
      path: `${NOTIFICATION_LINKS.tank}/${event.tankId}`
    }))
    .with({ event: 'sessionFinished' }, (event) => ({
      message: 'session-finished',
      values: {
        nickname: event.nickname,
        battles: event.battles,
        winRate: event.winRate * 100,
        avgDamage: event.avgDamage,
        wn8: event.wn8 ?? NOTIFICATION_COPY.missing
      },
      path: `${playerPath(event.nickname)}?${new URLSearchParams({ [NOTIFICATION_LINKS.sessionParam]: event.sessionId }).toString()}`
    }))
    .with({ event: 'bonusCode' }, (event) => ({
      message: 'bonus-code',
      values: { code: event.code, description: event.description || NOTIFICATION_COPY.missing },
      path: NOTIFICATION_LINKS.bonusCodes
    }))
    .with({ event: 'premiumOffer' }, (event) => ({
      message: 'premium-offer',
      values: { tankName: event.tankName, discount: event.discountPercent ?? NOTIFICATION_COPY.missing },
      path: `${NOTIFICATION_LINKS.tank}/${event.tankId}`
    }))
    .with({ event: 'challengeResolved' }, (event) => ({
      message: 'challenge-resolved',
      values: { title: event.title, outcome: event.isSucceeded ? 'succeeded' : 'failed' },
      path: NOTIFICATION_LINKS.challenges
    }))
    .with({ event: 'clanEventReminder' }, (event) => ({
      message: 'clan-event-reminder',
      values: { clanTag: event.clanTag, title: event.title, startsAt: event.startsAt ?? NOTIFICATION_COPY.missing },
      path: clanWorkspacePath(event.clanId)
    }))
    .with({ event: 'clanWeeklyReport' }, (event) => ({
      message: 'clan-weekly-report',
      values: {
        clanTag: event.clanTag,
        events: event.report.events,
        attendance: event.report.attendanceRate === null ? NOTIFICATION_COPY.missing : event.report.attendanceRate * 100,
        newCandidates: event.report.newCandidates,
        inactiveMembers: event.report.inactiveMembers
      },
      path: clanWorkspacePath(event.clanId)
    }))
    .with({ event: 'badgeAwarded' }, (event) => ({
      message: 'badge-awarded',
      values: { title: event.title },
      path: NOTIFICATION_LINKS.badges
    }))
    .exhaustive();

export const renderNotification = ({ notification, locale, webUrl }: RenderNotificationInput): RenderedNotification => {
  const { message, values, path } = messageOf(notification);

  return {
    title: notificationText({ locale, key: `${message}-title`, values }),
    body: notificationText({ locale, key: `${message}-body`, values }),
    url: link({ webUrl, path })
  };
};

export const renderDigest = ({ digest, locale, webUrl }: RenderDigestInput): RenderedNotification => {
  const title = notificationText({ locale, key: 'digest-title' });
  const url = link({ webUrl, path: NOTIFICATION_LINKS.digest });

  if (digest.battles === 0) {
    return { title, body: notificationText({ locale, key: 'digest-empty' }), url };
  }

  return {
    title,
    body: notificationText({
      locale,
      key: 'digest-body',
      values: {
        battles: digest.battles,
        sessions: digest.sessions,
        winRate: (digest.wins / digest.battles) * 100,
        avgDamage: digest.damageDealt / digest.battles,
        marksGained: digest.marksGained
      }
    }),
    url
  };
};
