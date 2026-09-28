import path from 'node:path';

export const CLIENT_ROOT = path.resolve(import.meta.dirname, '..');

export const REPO_ROOT = path.resolve(CLIENT_ROOT, '..', '..', '..');

// Sass load path for workspace style packages (`@use 'design-tokens'`). Turbopack's sass-loader resolves
// `@otmetki/*` itself and then cannot follow the package's relative `@forward`s, so Sass loads them by path.
export const WORKSPACE_PACKAGES = path.resolve(REPO_ROOT, 'packages');
