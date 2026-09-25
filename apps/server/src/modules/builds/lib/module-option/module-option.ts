import type { ModuleBase } from '@bronevik/gamedata';
import type { ModuleOption } from '@bronevik/schemas';

export const toModuleOption = (module: ModuleBase): ModuleOption => ({
  moduleId: module.moduleId,
  name: module.name,
  displayName: module.displayName,
  tier: module.tier ?? null
});
