export const PAGE_IDS = ['home', 'install', 'components', 'sets', 'profiles', 'backups', 'settings', 'help', 'about'] as const;

export const PAGES = {
  initial: 'home'
} as const;

export const PAGE_SECTIONS = {
  home: { pages: ['home', 'install'], tabs: false },
  components: { pages: ['components'], tabs: false },
  sets: { pages: ['sets', 'profiles'], tabs: true },
  settings: { pages: ['settings', 'backups', 'about'], tabs: true },
  help: { pages: ['help'], tabs: false }
} as const;
