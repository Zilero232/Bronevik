import type { InstallPlan } from '../../api';

export type InstallBlocker = 'client' | 'noCatalog' | 'offline' | 'unavailable';

export type InstallBlockerInput = Pick<InstallPlan, 'catalog' | 'client' | 'source'>;
