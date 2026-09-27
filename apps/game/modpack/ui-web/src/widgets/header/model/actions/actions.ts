import type { Language } from '../../../../shared/i18n';

import { send } from '../../../../shared/api/protocol';
import { HEADER } from '../../config';

export const selectLanguage = (language: Language): void => {
  send({ type: 'language', language });
};

export const openSite = (): void => {
  send({ type: 'open', path: HEADER.sitePath });
};

export const closeWindow = (): void => {
  send({ type: 'close' });
};
