export const MANAGER_LINK = {
  scheme: 'triotmetki',
  hosts: { open: 'open', profile: 'profile', install: 'install' },
  presetParam: 'preset',
  presets: ['recommended', 'minimal', 'streamer'],
  profileCode: { prefix: 'TM1.', maxLength: 48 * 1024, pattern: /^TM1\.[\w-]+={0,2}$/ }
} as const;
