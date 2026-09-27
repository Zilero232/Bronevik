import { Archive, Home, Info, Layers, Settings, UserRoundCog } from 'lucide-react';

export const NAV_ICONS = {
  home: Home,
  components: Layers,
  profiles: UserRoundCog,
  backups: Archive,
  settings: Settings,
  about: Info
} as const;
