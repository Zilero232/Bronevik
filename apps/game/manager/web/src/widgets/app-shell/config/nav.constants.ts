import { Archive, Boxes, CircleHelp, Home, Info, Layers, PackagePlus, Settings, UserRoundCog } from 'lucide-react';

export const NAV_ICONS = {
  home: Home,
  install: PackagePlus,
  components: Layers,
  sets: Boxes,
  profiles: UserRoundCog,
  backups: Archive,
  settings: Settings,
  help: CircleHelp,
  about: Info
} as const;

export const NAV_GROUPS = [
  { id: 'modpack', pages: ['home', 'install', 'components'] },
  { id: 'mine', pages: ['sets', 'profiles', 'backups'] },
  { id: 'app', pages: ['settings', 'help', 'about'] }
] as const;

export const NAV_MARKER = {
  problemTones: ['danger', 'warning']
} as const;
