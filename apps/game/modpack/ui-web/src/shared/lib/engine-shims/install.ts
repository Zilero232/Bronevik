import type { EngineScope } from './engine-shims.types';

import { describeEngine, installEngineShims } from './engine-shims';

const scope: EngineScope = globalThis;
const installed = installEngineShims({ scope, document });

export const engineReport = (): string => describeEngine({ scope, document, installed });
