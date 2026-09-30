import { isIncludedIn } from 'remeda';

import type { ChangelogEntries, ChangelogSections, ComponentNotesInput, LocalizedNotes, ReleaseNotesInput } from './changelog.types';

import { CHANGELOG } from './changelog.constants';

const entryKey = (heading: string): string => heading.trim().split(/\s+/u).join(CHANGELOG.keySeparator);

const toNotes = (sections: ChangelogSections): LocalizedNotes | null => {
  const ru = sections.ru?.join('\n').trim();
  const en = sections.en?.join('\n').trim();

  return ru && en ? { ru, en } : null;
};

export const parseChangelog = (text: string): ChangelogEntries => {
  const entries = new Map<string, ChangelogSections>();
  let entry: ChangelogSections | null = null;
  let section: string[] | null = null;

  for (const line of text.split(/\r?\n/u)) {
    const heading = CHANGELOG.entryHeading.exec(line)?.[1];

    if (heading !== undefined) {
      const key = entryKey(heading);

      entry = entries.has(key) ? null : {};
      section = null;

      if (entry) {
        entries.set(key, entry);
      }

      continue;
    }

    const language = CHANGELOG.sectionHeading.exec(line)?.[1];

    if (language !== undefined) {
      section = entry && isIncludedIn(language, CHANGELOG.languages) ? (entry[language] = []) : null;

      continue;
    }

    section?.push(line);
  }

  return new Map(
    [...entries].flatMap(([key, sections]) => {
      const notes = toNotes(sections);

      return notes ? [[key, notes] as const] : [];
    })
  );
};

export const releaseNotes = ({ entries, version }: ReleaseNotesInput): LocalizedNotes | null => entries.get(version) ?? null;

export const componentNotes = ({ entries, id, version }: ComponentNotesInput): LocalizedNotes | null =>
  entries.get([id, version].join(CHANGELOG.keySeparator)) ?? null;
