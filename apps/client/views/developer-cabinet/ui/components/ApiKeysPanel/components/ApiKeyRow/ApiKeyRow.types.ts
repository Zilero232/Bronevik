import type { ApiKey } from '@otmetki/schemas';

export type ApiKeyRowProps = {
  apiKey: ApiKey;
  onRevoke: (apiKey: ApiKey) => void;
};
