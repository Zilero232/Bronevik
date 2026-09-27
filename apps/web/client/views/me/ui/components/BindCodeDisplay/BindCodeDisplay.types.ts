import type { BindCode } from '@otmetki/schemas';

export type BindCodeDisplayProps = {
  code: BindCode;
  onRenew: () => void;
};
