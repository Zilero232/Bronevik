import type { CreatedApiKey } from '@bronevik/schemas';

export type UseCreateKeyFormInput = {
  onCreated: (created: CreatedApiKey) => void;
};
