export const MODPACK_RELEASE_STATUSES = ['compatible', 'waiting'] as const;

export const MODPACK_RELEASES = {
  indexSchemaVersion: 1,
  wildcard: '*',
  gameVersionPattern: /^\d+(?:\.\d+){1,3}$/,
  gamePattern: /^\d+(?:\.(?:\d+|\*)){1,3}$/,
  semverPattern: /^\d+\.\d+\.\d+(?:-[\w.]+)?$/,
  componentIdPattern: /^[a-z][a-z0-9_]*$/,
  packageFilePattern: /^[\w.-]+\.(?:mtmod|wotmod)$/,
  sha256Pattern: /^[0-9a-f]{64}$/i
} as const;
