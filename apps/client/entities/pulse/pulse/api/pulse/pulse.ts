import type { Pulse, PulseInput } from './pulse.types';

import { pulseControllerGet } from '@/shared/api/generated';
import { fromSdk } from '@/shared/api/source';

export const getPulse = ({ signal }: PulseInput = {}): Promise<Pulse> => fromSdk(() => pulseControllerGet({ signal }));
