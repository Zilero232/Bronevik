import { useState } from 'preact/hooks';

import { send } from '../../../../../shared/api/protocol';
import { KEYS } from '../../../../../shared/config';

export const useBindForm = () => {
  const [code, setCode] = useState('');

  const bind = (): void => {
    const trimmed = code.trim();

    if (!trimmed) {
      return;
    }

    send({ type: 'bind', code: trimmed });
    setCode('');
  };

  return {
    code,
    bind,
    setCode,
    onKey: (key: string) => {
      if (key === KEYS.enter) {
        bind();
      }
    }
  };
};
