export type ApiKeyRow = {
  id: string;
  name: string | null;
  start: string | null;
  enabled: boolean;
  metadata: unknown;
  createdAt: Date;
  updatedAt: Date;
  lastRequest: Date | null;
  expiresAt: Date | null;
};
