import type { PatchStatus, PatchStatusKind } from '../../api';

export type StatusTone = 'accent' | 'danger' | 'neutral' | 'premium' | 'success' | 'warning';

export type StatusAction = 'migrate' | 'update' | null;

export type StatusView = {
  kind: PatchStatusKind;
  tone: StatusTone;
  action: StatusAction;
};

export type StatusViewInput = {
  status: PatchStatus;
  needsMigration: boolean;
};

export type StatusMessageValuesInput = {
  status: PatchStatus;
  modpackVersion: string | null;
};
