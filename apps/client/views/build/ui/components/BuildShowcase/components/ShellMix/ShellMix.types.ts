import type { ProvisionPick } from '@otmetki/schemas';

import type { ShellMixPart } from '../../../../../lib/showcase';

export type ShellMixProps = {
  consumables: readonly ProvisionPick[];
  shells: readonly ShellMixPart[];
};
