import type { PatchReport } from '@/entities/patch-report';

export type PatchActionKind = 'check' | 'migrate' | 'update';

export type UsePatchActionInput = {
  kind: PatchActionKind;
  clientPath: string | null;
};

export type PatchActionRunner = (clientPath: string | null) => Promise<PatchReport>;
