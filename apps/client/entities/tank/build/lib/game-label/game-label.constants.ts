export const GAME_LABEL = {
  asciiKey: /^[\w\s./-]+$/,
  locSuffix: /\/name$/,
  rolePrefix: /^(commander|gunner|driver|radioman|loader)_/,
  camelBoundary: /([a-z\d])([A-Z])/g,
  separators: /[_\s]+/g
} as const;
