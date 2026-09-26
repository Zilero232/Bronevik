import type { PlusFeature } from '@otmetki/schemas';

import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

import { PLUS_GUARD } from '../config';
import { PlusGuard } from '../guards';

export const RequiresPlus = (feature: PlusFeature) => applyDecorators(SetMetadata(PLUS_GUARD.featureKey, feature), UseGuards(PlusGuard));
