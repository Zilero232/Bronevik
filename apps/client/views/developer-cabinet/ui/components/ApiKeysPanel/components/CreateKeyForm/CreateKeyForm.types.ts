import type { CreatedApiKey } from '@bronevik/schemas';

export type CreateKeyFormProps = {
  onCreated: (created: CreatedApiKey) => void;
};
