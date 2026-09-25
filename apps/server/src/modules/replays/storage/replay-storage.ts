import type { PutObjectInput } from './storage.types';

export abstract class ReplayStorage {
  abstract put(input: PutObjectInput): Promise<void>;

  abstract get(key: string): Promise<Uint8Array>;

  abstract remove(key: string): Promise<void>;
}
