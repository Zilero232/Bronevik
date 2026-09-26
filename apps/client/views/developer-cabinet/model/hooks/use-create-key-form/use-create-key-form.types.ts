import type { CreatedApiKey } from '@otmetki/schemas';

export type UseCreateKeyFormInput = {
  onCreated: (created: CreatedApiKey) => void;
};
