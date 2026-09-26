import { describe, expect, it } from 'vitest';

import type { StorageEnv } from '../storage.types';

import { LocalDiskStorage } from '../local-disk.storage';
import { S3Storage } from '../s3.storage';
import { createObjectStorage } from '../storage.factory';

const s3Env: StorageEnv = {
  REPLAY_STORAGE: 's3',
  S3_ENDPOINT: 'http://127.0.0.1:9',
  S3_REGION: 'ru-central1',
  S3_BUCKET: 'replays',
  S3_ACCESS_KEY_ID: 'key',
  S3_SECRET_ACCESS_KEY: 'secret'
};

const requiredForS3: (keyof StorageEnv)[] = ['S3_BUCKET', 'S3_ACCESS_KEY_ID', 'S3_SECRET_ACCESS_KEY'];

describe('createObjectStorage', () => {
  it('uses the local disk when configured so', () => {
    expect(createObjectStorage({ env: { ...s3Env, REPLAY_STORAGE: 'local' }, root: 'storage' })).toBeInstanceOf(LocalDiskStorage);
  });

  it('uses S3 when fully configured', () => {
    expect(createObjectStorage({ env: s3Env, root: 'storage' })).toBeInstanceOf(S3Storage);
  });

  it.each(requiredForS3)('refuses to start S3 without %s', (key) => {
    expect(() => createObjectStorage({ env: { ...s3Env, [key]: '' }, root: 'storage' })).toThrow(key);
  });
});
