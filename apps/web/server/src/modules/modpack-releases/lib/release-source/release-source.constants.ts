// The modpack release comes from its workspace manifest: "version" and "otmetki.games" (the supported
// client patterns). Relative to the repository root.
export const RELEASE_SOURCE = {
  manifestFile: 'apps/game/modpack/package.json'
} as const;
