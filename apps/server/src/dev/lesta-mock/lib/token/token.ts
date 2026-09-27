import type { AccountOfTokenInput, MockAccessTokenInput, SignatureInput } from './token.types';

import { MOCK_SALT } from '../../config';
import { hashSeed } from '../random';

const ACCOUNT_HEX = 8;
const SIGNATURE_PARTS = 4;

const signature = ({ seed, accountId }: SignatureInput): string =>
  Array.from({ length: SIGNATURE_PARTS }, (_, part) => hashSeed(seed, MOCK_SALT.token, accountId, part).toString(16).padStart(8, '0')).join('');

export const mockAccessToken = ({ seed, accountId }: MockAccessTokenInput): string =>
  `${signature({ seed, accountId })}${accountId.toString(16).padStart(ACCOUNT_HEX, '0')}`;

export const accountOfToken = ({ seed, token }: AccountOfTokenInput): number | null => {
  if (!token || !/^[0-9a-f]{40}$/.test(token)) {
    return null;
  }

  const accountId = Number.parseInt(token.slice(-ACCOUNT_HEX), 16);

  return mockAccessToken({ seed, accountId }) === token ? accountId : null;
};
