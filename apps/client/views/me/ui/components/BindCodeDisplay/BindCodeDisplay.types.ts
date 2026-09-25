import type { BindCode } from '@bronevik/schemas';

export type BindCodeDisplayProps = {
  code: BindCode;
  onRenew: () => void;
};
