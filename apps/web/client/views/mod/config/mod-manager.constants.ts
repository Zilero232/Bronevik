import { ArchiveRestore, Bug, CloudCog, Feather, FolderSync, Layers, SearchCheck, UserCog } from 'lucide-react';

export const MOD_MANAGER_FEATURES = [
  { id: 'sets', icon: Layers },
  { id: 'profiles', icon: UserCog },
  { id: 'sync', icon: CloudCog },
  { id: 'patches', icon: FolderSync },
  { id: 'backups', icon: ArchiveRestore },
  { id: 'conflicts', icon: SearchCheck },
  { id: 'perf', icon: Feather },
  { id: 'report', icon: Bug }
] as const;
