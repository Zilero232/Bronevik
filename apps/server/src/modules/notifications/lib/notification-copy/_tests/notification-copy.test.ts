import { keys } from 'remeda';
import { describe, expect, it } from 'vitest';

import type { ParsedNotification } from '../../../contracts';

import { NOTIFICATION_COPY, NOTIFICATION_LOCALES } from '../../../config';
import { fillTemplate, renderDigest, renderNotification, resolveNotificationLocale } from '../notification-copy';

const webUrl = 'https://bronevik.app';

const moeGained: ParsedNotification = {
  event: 'moeGained',
  accountId: 1,
  nickname: 'Tanker',
  tankId: 1,
  tankName: 'Об. 140',
  marks: 3,
  isFollowed: false
};

const session: ParsedNotification = {
  event: 'sessionFinished',
  accountId: 1,
  nickname: 'Tanker',
  sessionId: 's',
  battles: 10,
  winRate: 0.6,
  avgDamage: 2500,
  wn8: null
};

const samples: ParsedNotification[] = [
  moeGained,
  { event: 'moeThresholdDropped', tankId: 1, tankName: 'Об. 140', mark: 3, from: 4100, to: 4000 },
  session,
  { event: 'bonusCode', code: 'TANKS2026', description: null },
  { event: 'premiumOffer', tankId: 1, tankName: 'Об. 140', discountPercent: 30 },
  { event: 'challengeResolved', challengeId: 'c', title: '3000 on LT', isSucceeded: true }
];

describe('fillTemplate', () => {
  it('replaces every known placeholder and keeps unknown ones visible', () => {
    expect(fillTemplate({ template: '{a} and {b}', values: { a: 1 } })).toBe('1 and {b}');
  });
});

describe('resolveNotificationLocale', () => {
  it('maps a region tag onto a supported locale and defaults to Russian', () => {
    expect(resolveNotificationLocale('en-US')).toBe('en');
    expect(resolveNotificationLocale(null)).toBe('ru');
    expect(resolveNotificationLocale('de')).toBe('ru');
  });
});

describe('NOTIFICATION_COPY', () => {
  it('has the same keys in every locale', () => {
    const [first, ...rest] = NOTIFICATION_LOCALES;

    for (const locale of rest) {
      expect(keys(NOTIFICATION_COPY[locale]).sort()).toEqual(keys(NOTIFICATION_COPY[first]).sort());
    }
  });
});

describe('renderNotification', () => {
  it.each(NOTIFICATION_LOCALES)('leaves no placeholder unfilled in %s', (locale) => {
    for (const notification of samples) {
      const rendered = renderNotification({ notification, locale, webUrl });

      expect(rendered.body).not.toMatch(/\{\w+\}/u);
      expect(rendered.title.length).toBeGreaterThan(0);
      expect(rendered.url.startsWith(webUrl)).toBe(true);
    }
  });

  it('uses the friend wording for a followed player', () => {
    const own = renderNotification({ notification: moeGained, locale: 'en', webUrl });
    const followed = renderNotification({ notification: { ...moeGained, isFollowed: true }, locale: 'en', webUrl });

    expect(followed.title).toBe(NOTIFICATION_COPY.en.moeGainedFollowed.title);
    expect(own.title).toBe(NOTIFICATION_COPY.en.moeGained.title);
  });

  it('shows a dash for a missing WN8 instead of "null"', () => {
    const rendered = renderNotification({ notification: session, locale: 'ru', webUrl });

    expect(rendered.body).toContain(NOTIFICATION_COPY.ru.missing);
    expect(rendered.body).not.toContain('null');
  });
});

describe('renderDigest', () => {
  it('uses the empty-week text when there were no battles', () => {
    const rendered = renderDigest({ digest: { battles: 0, wins: 0, damageDealt: 0, sessions: 0, marksGained: 0 }, locale: 'en', webUrl });

    expect(rendered.body).toBe(NOTIFICATION_COPY.en.digest.empty);
  });

  it('averages damage over battles', () => {
    const rendered = renderDigest({ digest: { battles: 4, wins: 2, damageDealt: 10_000, sessions: 1, marksGained: 1 }, locale: 'en', webUrl });

    expect(rendered.body).toContain('2500');
    expect(rendered.body).toContain('50.0');
  });
});
