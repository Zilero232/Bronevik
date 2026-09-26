import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { S3Storage } from '../s3.storage';

const options = {
  bucket: 'replays',
  prefix: 'prod/',
  region: 'ru-central1',
  endpoint: 'http://127.0.0.1:9',
  accessKeyId: 'key',
  secretAccessKey: 'secret'
};

const body = new TextEncoder().encode('replay bytes');

describe('S3Storage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('writes under the configured prefix with the content type', async () => {
    const send = vi.spyOn(S3Client.prototype, 'send').mockImplementation(async () => ({}));

    await new S3Storage(options).put({ key: 'a.wotreplay', body, contentType: 'application/octet-stream' });

    expect(send.mock.calls[0]?.[0]).toBeInstanceOf(PutObjectCommand);

    expect(send.mock.calls.map(([command]) => command.input)).toEqual([
      { Bucket: 'replays', Key: 'prod/a.wotreplay', Body: body, ContentType: 'application/octet-stream' }
    ]);
  });

  it('reads and removes the same prefixed key', async () => {
    const send = vi
      .spyOn(S3Client.prototype, 'send')
      .mockImplementation(async (command) => (command instanceof GetObjectCommand ? { Body: { transformToByteArray: async () => body } } : {}));

    const storage = new S3Storage(options);

    expect(await storage.get('a.wotreplay')).toEqual(body);
    await storage.remove('a.wotreplay');

    expect(send.mock.calls[1]?.[0]).toBeInstanceOf(DeleteObjectCommand);

    expect(send.mock.calls.map(([command]) => command.input)).toEqual([
      expect.objectContaining({ Key: 'prod/a.wotreplay' }),
      expect.objectContaining({ Key: 'prod/a.wotreplay' })
    ]);
  });

  it('fails clearly on an object without a body', async () => {
    vi.spyOn(S3Client.prototype, 'send').mockImplementation(async () => ({}));

    await expect(new S3Storage(options).get('a.wotreplay')).rejects.toThrow('no body');
  });
});
