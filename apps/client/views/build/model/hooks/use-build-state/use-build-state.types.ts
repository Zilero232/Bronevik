import type { BuildContextValue } from '../../context';

export type UseBuildStateInput = Pick<BuildContextValue, 'options' | 'vehicle'>;
