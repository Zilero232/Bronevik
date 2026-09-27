import type { RotationStepInput } from './rotation-cycle.types';

export const rotationStep = ({ index, count, step = 1 }: RotationStepInput): number => (count > 0 ? (((index + step) % count) + count) % count : 0);
