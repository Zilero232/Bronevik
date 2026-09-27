import { isValid, parse } from 'date-fns';

import { DATE_FORMATS } from '../../config';

export const parseLocalDateTime = (text: string | null): Date | null => {
  if (!text) {
    return null;
  }

  const date = parse(text, DATE_FORMATS.localDateTime, new Date(0));

  return isValid(date) ? date : null;
};

export const fromUnixSeconds = (seconds: number | null): Date | null => (seconds === null ? null : new Date(seconds * 1_000));
