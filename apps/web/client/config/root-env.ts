import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { REPO_ROOT } from './paths';

// The browser build reads NEXT_PUBLIC_*; the Next server also reads INTERNAL_API_TOKEN and LESTA_NOTICE
// at runtime (shared/config/server-env). They are never NEXT_PUBLIC_, so they stay out of the browser bundle.
const ROOT_VARIABLE = /^(NEXT_PUBLIC_[A-Z0-9_]*|INTERNAL_API_TOKEN|LESTA_NOTICE)=(.*)$/;

export const loadRootEnv = () => {
  const rootEnv = path.resolve(REPO_ROOT, '.env');

  if (!existsSync(rootEnv)) {
    return;
  }

  for (const line of readFileSync(rootEnv, 'utf8').split('\n')) {
    const match = ROOT_VARIABLE.exec(line.trim());

    if (match && process.env[match[1]] === undefined) {
      process.env[match[1]] = match[2];
    }
  }
};
