import { useState } from 'preact/hooks';

import type { Language } from '../../../../shared/i18n/i18n.types';

import { send } from '../../protocol/protocol';

export const useHeader = () => {
  const [code, setCode] = useState('');

  return {
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
