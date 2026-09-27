import { RUSSIAN_MONTHS } from '../scrape.constants';

const MONTH_PATTERN = Object.keys(RUSSIAN_MONTHS).join('|');

export const RUSSIAN_DATE = {
  deadline: new RegExp(`до\\s+(\\d{1,2})\\s+(${MONTH_PATTERN})(?:\\s+(\\d{4}))?(?:\\s*(?:г\\.?)?\\s*,?\\s*(\\d{1,2})[:.](\\d{2}))?`, 'giu'),
  day: new RegExp(`(\\d{1,2})\\s+(${MONTH_PATTERN})(?:\\s+(\\d{4}))?`, 'iu')
} as const;
