import type { Coach } from '../coaching';

export type CoachRouteMeta = Pick<Coach, 'headline' | 'isActive' | 'name'>;
