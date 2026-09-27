export const SETTINGS = {
  languages: ['auto', 'ru', 'en'],
  checkIntervals: [
    { minutes: 15, label: 'm15' },
    { minutes: 30, label: 'm30' },
    { minutes: 60, label: 'h1' },
    { minutes: 180, label: 'h3' },
    { minutes: 720, label: 'h12' }
  ]
} as const;
