import type { MockHexInput } from './mocks.types';

export const mockHex = ({ random, length }: MockHexInput) => Array.from({ length }, () => Math.floor(random() * 16).toString(16)).join('');

export const mockUuid = (random: () => number) =>
  `${mockHex({ random, length: 8 })}-${mockHex({ random, length: 4 })}-4${mockHex({ random, length: 3 })}-8${mockHex({ random, length: 3 })}-${mockHex({ random, length: 12 })}`;
