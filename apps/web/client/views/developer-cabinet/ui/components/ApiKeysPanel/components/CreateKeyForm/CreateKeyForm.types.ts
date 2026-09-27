import type { CreatedApiKey } from '@otmetki/schemas';

export type CreateKeyFormProps = {
  onCreated: (created: CreatedApiKey) => void;
};
