import { po } from 'gettext-parser';

import type { Localize, PersonalMissionJson, RenderTextInput } from './personal-missions.types';

import { PERSONAL_MISSION_KEYS, PERSONAL_MISSION_LOCALE } from './personal-missions.constants';

const numberFormat = new Intl.NumberFormat(PERSONAL_MISSION_LOCALE);

export const parsePoMessages = (source: string): Record<string, string> => {
  const messages: Record<string, string> = {};

  for (const context of Object.values(po.parse(source).translations)) {
    for (const [msgid, translation] of Object.entries(context)) {
      const text = translation.msgstr[0];

      if (msgid && text) {
        messages[msgid] = text;
      }
    }
  }

  return messages;
};

export const createLocalize =
  (messages: Record<string, string>): Localize =>
  (key) => {
    if (!key) {
      return undefined;
    }

    const text = messages[key.replace(PERSONAL_MISSION_KEYS.localizationPrefix, '')]?.trim();

    return text || undefined;
  };

const formatValue = (value: PersonalMissionJson | undefined): string | undefined => {
  if (typeof value === 'number') {
    return numberFormat.format(value);
  }

  return typeof value === 'string' ? value : undefined;
};

export const renderText = ({ template, values }: RenderTextInput): string =>
  template
    .replaceAll(PERSONAL_MISSION_KEYS.placeholder, (placeholder, name: string) => formatValue(values[name]) ?? placeholder)
    .replaceAll('%%', '%');
