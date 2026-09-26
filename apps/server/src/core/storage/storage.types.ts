import type { Env } from '../../config';

export type PutObjectInput = {
  key: string;
  body: Uint8Array;
  contentType: string;
};

export type StorageEnv = Pick<Env, 'REPLAY_STORAGE' | 'S3_ACCESS_KEY_ID' | 'S3_BUCKET' | 'S3_ENDPOINT' | 'S3_REGION' | 'S3_SECRET_ACCESS_KEY'>;

export type CreateObjectStorageInput = {
  env: StorageEnv;
  root: string;
  prefix?: string;
};

export type S3StorageOptions = {
  bucket: string;
  prefix: string;
  region: string;
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
};

export type ObjectStorageModuleOptions = {
  rootEnv: 'REPLAY_STORAGE_DIR';
  prefix?: string;
};
