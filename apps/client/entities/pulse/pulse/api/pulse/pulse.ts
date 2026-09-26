import { pulseControllerGet } from '@/shared/api/generated';
import { fromSdk } from '@/shared/api/source';

import type { Pulse, PulseInput } from './pulse.types';

export const getPulse = ({ signal }: PulseInput = {}): Promise<Pulse> => fromSdk(() => pulseControllerGet({ signal }));
