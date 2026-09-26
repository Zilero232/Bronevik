import type { Pulse, PulseInput } from './pulse.types';

import { pulseControllerGet } from '../generated';
import { fromSdk } from '../source';

export const getPulse = ({ signal }: PulseInput = {}): Promise<Pulse> => fromSdk(() => pulseControllerGet({ signal }));
