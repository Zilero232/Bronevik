import { useState } from 'preact/hooks';

import type { Language } from '../../../../shared/i18n';

import { LANGUAGES } from '../../../../shared/i18n';
import { send } from '../../protocol';

export const useHeader = () => {
  const [code, setCode] = useState('');

  return {
    languages: LANGUAGES.map((language) => ({ value: language, label: language.toUpperCase() })),
    code,
    setCode,
    bind: () => {
      if (code.trim()) {
        send({ type: 'bind', code: code.trim() });
        setCode('');
      }
    },
    language: (language: Language) => send({ type: 'language', language }),
    openSite: () => send({ type: 'open', path: '/' }),
    close: () => send({ type: 'close' })
  };
};
