import { match } from 'ts-pattern';

import type {
  FillTemplateInput,
  LinkInput,
  NotificationLocale,
  RenderDigestInput,
  RenderedNotification,
  RenderNotificationInput
} from './notification-copy.types';

import { NOTIFICATION_COPY, NOTIFICATION_LINKS, NOTIFICATION_LOCALES } from '../../config/copy.config';

export const resolveNotificationLocale = (raw: string | null | undefined): NotificationLocale =>
  NOTIFICATION_LOCALES.find((locale) => raw?.toLowerCase().startsWith(locale)) ?? 'ru';

export const fillTemplate = ({ template, values }: FillTemplateInput): string =>
  template.replaceAll(/\{(\w+)\}/g, (placeholder, key: string) => (key in values ? String(values[key]) : placeholder)).trim();

const link = ({ webUrl, template, values }: LinkInput): string => new URL(fillTemplate({ template, values }), webUrl).href;

const percent = (value: number): string => (value * 100).toFixed(1);

export const renderNotification = ({ notification, locale, webUrl }: RenderNotificationInput): RenderedNotification => {
  const copy = NOTIFICATION_COPY[locale];

  return match(notification)
    .with({ event: 'moeGained' }, (event) => {
      const text = event.isFollowed ? copy.moeGainedFollowed : copy.moeGained;
      const values = { nickname: event.nickname, marks: event.marks, tankName: event.tankName };

      return {
        title: text.title,
        body: fillTemplate({ template: text.body, values }),
        url: link({ webUrl, template: NOTIFICATION_LINKS.player, values: { nickname: encodeURIComponent(event.nickname) } })
      };
    })
    .with({ event: 'moeThresholdDropped' }, (event) => ({
      title: copy.moeThresholdDropped.title,
      body: fillTemplate({
        template: copy.moeThresholdDropped.body,
        values: { tankName: event.tankName, mark: event.mark, from: event.from, to: event.to }
      }),
      url: link({ webUrl, template: NOTIFICATION_LINKS.tank, values: { tankId: event.tankId } })
    }))
    .with({ event: 'sessionFinished' }, (event) => ({
      title: copy.sessionFinished.title,
      body: fillTemplate({
        template: copy.sessionFinished.body,
        values: {
          nickname: event.nickname,
          battles: event.battles,
          winRate: percent(event.winRate),
          avgDamage: Math.round(event.avgDamage),
          wn8: event.wn8 === null ? copy.missing : Math.round(event.wn8)
        }
      }),
      url: link({
        webUrl,
        template: NOTIFICATION_LINKS.session,
        values: { nickname: encodeURIComponent(event.nickname), sessionId: event.sessionId }
      })
    }))
    .with({ event: 'bonusCode' }, (event) => ({
      title: copy.bonusCode.title,
      body: fillTemplate({ template: copy.bonusCode.body, values: { code: event.code, description: event.description ?? '' } }),
      url: link({ webUrl, template: NOTIFICATION_LINKS.bonusCodes, values: {} })
    }))
    .with({ event: 'premiumOffer' }, (event) => ({
      title: copy.premiumOffer.title,
      body: fillTemplate({
        template: copy.premiumOffer.body,
        values: { tankName: event.tankName, discountPercent: event.discountPercent ?? copy.missing }
      }),
      url: link({ webUrl, template: NOTIFICATION_LINKS.tank, values: { tankId: event.tankId } })
    }))
    .with({ event: 'challengeResolved' }, (event) => ({
      title: copy.challengeResolved.title,
      body: fillTemplate({
        template: copy.challengeResolved.body,
        values: { title: event.title, outcome: event.isSucceeded ? copy.challengeOutcome.succeeded : copy.challengeOutcome.failed }
      }),
      url: link({ webUrl, template: NOTIFICATION_LINKS.challenges, values: {} })
    }))
    .with({ event: 'clanEventReminder' }, (event) => {
      const url = link({ webUrl, template: NOTIFICATION_LINKS.clanWorkspace, values: { clanId: event.clanId } });

      if (event.report) {
        return {
          title: fillTemplate({ template: copy.clanWeeklyReport.title, values: { clanTag: event.clanTag } }),
          body: fillTemplate({
            template: copy.clanWeeklyReport.body,
            values: {
              events: event.report.events,
              attendance: event.report.attendanceRate === null ? copy.missing : Math.round(event.report.attendanceRate * 100),
              newCandidates: event.report.newCandidates,
              inactiveMembers: event.report.inactiveMembers
            }
          }),
          url
        };
      }

      return {
        title: fillTemplate({ template: copy.clanEventReminder.title, values: { clanTag: event.clanTag } }),
        body: fillTemplate({ template: copy.clanEventReminder.body, values: { title: event.title, startsAt: event.startsAt ?? copy.missing } }),
        url
      };
    })
    .with({ event: 'badgeAwarded' }, (event) => ({
      title: copy.badgeAwarded.title,
      body: fillTemplate({ template: copy.badgeAwarded.body, values: { title: event.title } }),
      url: link({ webUrl, template: NOTIFICATION_LINKS.badges, values: {} })
    }))
    .exhaustive();
};

export const renderDigest = ({ digest, locale, webUrl }: RenderDigestInput): RenderedNotification => {
  const copy = NOTIFICATION_COPY[locale].digest;
  const url = link({ webUrl, template: NOTIFICATION_LINKS.digest, values: {} });

  if (digest.battles === 0) {
    return { title: copy.title, body: copy.empty, url };
  }

  return {
    title: copy.title,
    body: fillTemplate({
      template: copy.body,
      values: {
        battles: digest.battles,
        sessions: digest.sessions,
        winRate: percent(digest.wins / digest.battles),
        avgDamage: Math.round(digest.damageDealt / digest.battles),
        marksGained: digest.marksGained
      }
    }),
    url
  };
};
