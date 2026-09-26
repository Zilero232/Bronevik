import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import { BOT, BOT_COMMANDS, BOT_LOCALE_FILES, SETTINGS_MENU } from '..';
import { createBotI18n } from '../../providers';

const messageKeys = (locale: (typeof BOT.locales)[number]) =>
  readFileSync(BOT_LOCALE_FILES[locale], 'utf8')
    .split(/\r?\n/u)
    .flatMap((line) => /^([a-z][\w-]*)\s*=/u.exec(line)?.[1] ?? [])
    .sort();

describe('bot locales', () => {
  it('define the same messages in every language', () => {
    const [first, ...rest] = BOT.locales;

    for (const locale of rest) {
      expect(messageKeys(locale)).toEqual(messageKeys(first));
    }
  });

  it('describe every registered command and every settings toggle', () => {
    const required = [
      ...BOT_COMMANDS.map((command) => `cmd-${command}`),
      ...SETTINGS_MENU.channels.map((channel) => `settings-channel-${channel}`),
      ...SETTINGS_MENU.events.map((event) => `settings-event-${event}`)
    ];

    for (const locale of BOT.locales) {
      expect(messageKeys(locale)).toEqual(expect.arrayContaining(required));
    }
  });

  it('parse with Fluent and substitute variables', () => {
    const i18n = createBotI18n();

    expect(i18n.t('en', 'login-link', { minutes: 10 })).toContain('10');
    expect(i18n.t('ru', 'login-link', { minutes: 10 })).toContain('10');
  });
});
