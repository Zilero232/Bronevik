import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import { componentNotes, parseChangelog, releaseNotes } from '../changelog';

const CHANGELOG_TEXT = [
  '# Changelog',
  '',
  'Intro text that is not an entry.',
  '',
  '## 0.2.0',
  '',
  '### ru',
  '',
  'Новое окно.',
  '',
  '- Пункт.',
  '',
  '### en',
  '',
  'A new window.',
  '',
  '- Item.',
  '',
  '## hit_log 0.3.0',
  '',
  '### ru',
  '',
  'Лог попаданий.',
  '',
  '### en',
  '',
  'Hit log.',
  '',
  '## gun_arc 0.1.0',
  '',
  '### ru',
  '',
  'Только русский.'
].join('\r\n');

const entries = parseChangelog(CHANGELOG_TEXT);

describe('parseChangelog', () => {
  it('reads each entry as trimmed markdown per language, whatever the line endings', () => {
    expect(releaseNotes({ entries, version: '0.2.0' })).toEqual({ ru: 'Новое окно.\n\n- Пункт.', en: 'A new window.\n\n- Item.' });
  });

  it('skips an entry that lacks one of the languages', () => {
    expect(componentNotes({ entries, id: 'gun_arc', version: '0.1.0' })).toBeNull();
  });

  it('reads the entries of the real modpack changelog', () => {
    const real = parseChangelog(readFileSync(new URL('../../../../../../../../game/modpack/CHANGELOG.md', import.meta.url), 'utf8'));

    expect(real.size).toBeGreaterThan(0);
    expect([...real.values()].every((notes) => notes.ru.length > 0 && notes.en.length > 0)).toBe(true);
  });
});

describe('releaseNotes', () => {
  it('answers null for a version with no entry', () => {
    expect(releaseNotes({ entries, version: '9.9.9' })).toBeNull();
  });
});

describe('componentNotes', () => {
  it('finds the entry of a component version', () => {
    expect(componentNotes({ entries, id: 'hit_log', version: '0.3.0' })).toEqual({ ru: 'Лог попаданий.', en: 'Hit log.' });
  });

  it('does not take a modpack entry for a component one', () => {
    expect(componentNotes({ entries, id: 'hit_log', version: '0.2.0' })).toBeNull();
  });
});
