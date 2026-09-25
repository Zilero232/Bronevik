import type { ApiKey } from '@bronevik/schemas';

export type ApiKeyRowProps = {
  apiKey: ApiKey;
  onRevoke: (apiKey: ApiKey) => void;
};
