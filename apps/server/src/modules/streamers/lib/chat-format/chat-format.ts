import type { ChatNumberInput } from './chat-format.types';

export const chatNumber = ({ value, digits = 0, missing }: ChatNumberInput): string =>
  value === null || value === undefined || !Number.isFinite(value) ? missing : value.toFixed(digits);
