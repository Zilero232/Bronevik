import type { NicknameErrorKind } from './nickname-form.types';

import { NICKNAME_ERROR_KINDS } from '../../config';

export const nicknameErrorKind = (type: string | undefined): NicknameErrorKind | null => {
  if (type === undefined) {
    return null;
  }

  return NICKNAME_ERROR_KINDS.find((kind) => kind === type) ?? 'invalid';
};
