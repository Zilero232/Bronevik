import path from 'node:path';

export const WIDGET_FIXTURE = {
  dir: path.resolve(import.meta.dirname, '../../../api/hud-protocol/_tests/fixtures/widgets')
} as const;
