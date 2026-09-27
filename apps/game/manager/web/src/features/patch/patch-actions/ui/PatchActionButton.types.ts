import type { PatchActionKind } from '../model/hooks';

export type PatchActionButtonProps = {
  kind: PatchActionKind;
  clientPath: string | null;
};
