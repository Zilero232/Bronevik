import type { SupertestChangeView } from '../../supertest.types';

export type ChangeVerdict = 'buff' | 'nerf' | 'neutral';

export type ChangeVerdictInput = Pick<SupertestChangeView, 'from' | 'live' | 'param' | 'to'>;

export type ChangeBaselineInput = Pick<ChangeVerdictInput, 'from' | 'live'>;
