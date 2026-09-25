export const SCRAPE = {
  delaySecs: 10,
  maxRetries: 1,
  timeoutSecs: 30,
  moscowOffset: '+03:00',
  accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8'
} as const;

export const RUSSIAN_MONTHS = {
  января: 0,
  февраля: 1,
  марта: 2,
  апреля: 3,
  мая: 4,
  июня: 5,
  июля: 6,
  августа: 7,
  сентября: 8,
  октября: 9,
  ноября: 10,
  декабря: 11
} as const;
