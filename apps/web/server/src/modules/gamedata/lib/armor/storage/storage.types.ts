import type { ObjectStorage, StorageEnv } from '../../../../../core';

export type ArmorStorage = Pick<ObjectStorage, 'get' | 'put' | 'remove'>;

export type ArmorStorageEnv = StorageEnv & {
  ARMOR_STORAGE_DIR: string;
};
