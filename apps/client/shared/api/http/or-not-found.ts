import { NotFoundError } from '../source';

export const orNotFound = <T>(value: T | null): T => {
  if (value === null) {
    throw new NotFoundError();
  }

  return value;
};
