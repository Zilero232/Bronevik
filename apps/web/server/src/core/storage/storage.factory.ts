import type { CreateObjectStorageInput } from './storage.types';

import { LocalDiskStorage } from './local-disk.storage';
import { ObjectStorage } from './object-storage';
import { S3Storage } from './s3.storage';

export const createObjectStorage = ({ env, root, prefix = '' }: CreateObjectStorageInput): ObjectStorage => {
  if (env.REPLAY_STORAGE === 'local') {
    return new LocalDiskStorage(root);
  }

  if (!env.S3_BUCKET || !env.S3_ACCESS_KEY_ID || !env.S3_SECRET_ACCESS_KEY) {
    throw new Error('REPLAY_STORAGE=s3 needs S3_BUCKET, S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY');
  }

  return new S3Storage({
    bucket: env.S3_BUCKET,
    prefix,
    region: env.S3_REGION,
    endpoint: env.S3_ENDPOINT,
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY
  });
};
