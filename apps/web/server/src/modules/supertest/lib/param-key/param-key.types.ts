import type { SUPERTEST_PARAMS } from '../../config';

export type SupertestParamMeta = (typeof SUPERTEST_PARAMS)[number];

export type SupertestParamKey = SupertestParamMeta['key'];
