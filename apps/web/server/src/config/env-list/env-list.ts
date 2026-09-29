import { ENV_LIST } from './env-list.constants';

export const envList = (value: string): string[] =>
  value
    .split(ENV_LIST.separator)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
