import type { Pulse } from '@/shared/api/generated';

import { pulseControllerGet } from '@/shared/api/generated';
import { fromSdk } from '@/shared/api/source';

import type { PulseInput } from './pulse.types';

export const getPulse = ({ signal }: PulseInput = {}): Promise<Pulse> => fromSdk(() => pulseControllerGet({ signal }));
