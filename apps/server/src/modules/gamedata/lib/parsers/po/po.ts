import { po } from 'gettext-parser';

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
