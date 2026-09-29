// The release versions come from the workspace manifests: the modpack "version" and "otmetki.games" (the
// supported client patterns), and the manager "version". Relative to the repository root.
export const RELEASE_SOURCE = {
  manifestFile: 'apps/game/modpack/package.json',
  managerManifestFile: 'apps/game/manager/package.json'
} as const;
