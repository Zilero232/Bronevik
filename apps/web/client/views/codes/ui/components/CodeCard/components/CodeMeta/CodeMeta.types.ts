import type { BonusCode } from '@otmetki/schemas';

export type CodeMetaProps = {
  code: Pick<BonusCode, 'discoveredAt' | 'expiresAt' | 'source'>;
  sourceHref: string | undefined;
};
