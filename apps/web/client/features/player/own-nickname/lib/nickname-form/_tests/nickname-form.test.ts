import { describe, expect, it } from 'vitest';

import { nicknameErrorKind, nicknameFormSchema } from '..';
import { NICKNAME_ERROR_KINDS } from '../../../config';

describe('nicknameErrorKind', () => {
  it('keeps the lookup failures and folds every validation failure into invalid', () => {
    expect(nicknameErrorKind(undefined)).toBeNull();
    NICKNAME_ERROR_KINDS.forEach((kind) => expect(nicknameErrorKind(kind)).toBe(kind));
    expect(nicknameErrorKind('too_small')).toBe('invalid');
  });
});

describe('nicknameFormSchema', () => {
  it('trims the nickname and rejects characters a nickname cannot have', () => {
    expect(nicknameFormSchema.parse({ nickname: '  BERKUT83 ' })).toEqual({ nickname: 'BERKUT83' });
    expect(nicknameFormSchema.safeParse({ nickname: 'bad nick' }).success).toBe(false);
  });
});
