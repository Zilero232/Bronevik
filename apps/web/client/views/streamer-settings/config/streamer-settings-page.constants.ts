export const STREAMER_SETTINGS_PAGE = {
  retries: 2,
  iconSize: 15,
  file: { suffix: '-settings.json', type: 'application/json', indent: 2 },
  managerTarget: { kind: 'install', preset: 'streamer' }
} as const;
