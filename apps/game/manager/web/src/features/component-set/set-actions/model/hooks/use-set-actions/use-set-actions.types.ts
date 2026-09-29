import type { ComponentSet } from '@/entities/component-set';

export type UseSetActionsInput = {
  set: ComponentSet;
};

export type NameDialog = 'duplicate' | 'rename' | null;
