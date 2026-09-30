import type { EscapeWatch } from './escape-answer.types';

import { send } from '../../../../shared/api/protocol';
import { stepBack } from '../../../../shared/lib/escape-stack';

const answerEscape = (): void => {
  send({ type: stepBack() ? 'escape' : 'close' });
};

export const watchEscape = (): EscapeWatch => {
  let answered = 0;

  return (asked) => {
    if (asked === null || asked <= answered) {
      return;
    }

    answered = asked;
    answerEscape();
  };
};
