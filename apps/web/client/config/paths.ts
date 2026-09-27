import path from 'node:path';

export const CLIENT_ROOT = path.resolve(import.meta.dirname, '..');

// Sass load path for workspace style packages (`@use '@otmetki/design-tokens'`): the isolated
// linker links them into the client's own node_modules, and turbopack's sass-loader does not resolve bare package names.
export const CLIENT_NODE_MODULES = path.resolve(CLIENT_ROOT, 'node_modules');

export const REPO_ROOT = path.resolve(CLIENT_ROOT, '..', '..', '..');
