import type { BuildOptions, LoadoutResult, PopularBuilds } from '@otmetki/schemas';

import type { BuildOptionsInput, CalculateLoadoutInput, PopularBuildsInput } from './builds.types';

import { buildsControllerLoadout, buildsControllerOptions, buildsControllerPopular } from '../generated';
import { fromSdk } from '../source';
import { BUILD_REQUEST } from './builds.constants';

export const getBuildOptions = ({ signal, tankId }: BuildOptionsInput): Promise<BuildOptions> =>
  fromSdk(() => buildsControllerOptions({ path: { id: tankId }, signal }));

export const calculateLoadout = ({ signal, tankId, request }: CalculateLoadoutInput): Promise<LoadoutResult> =>
  fromSdk(() => buildsControllerLoadout({ path: { id: tankId }, body: request, signal }));

export const listPopularBuilds = ({ signal, tankId, limit = BUILD_REQUEST.popularLimit }: PopularBuildsInput): Promise<PopularBuilds> =>
  fromSdk(() => buildsControllerPopular({ path: { id: tankId }, query: { limit }, signal }));
