import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { describe, expect, it } from 'vitest';
import { mock } from 'vitest-mock-extended';

import type { S3Sender } from '../storage.types';

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

const createStorage = () => {
  const client = mock<S3Sender>();

  return { client, storage: new S3Storage({ ...options, client }) };
};

describe('S3Storage', () => {
  it('writes under the configured prefix with the content type', async () => {
    const { client, storage } = createStorage();

    client.send.mockImplementation(async () => ({}));

    await storage.put({ key: 'a.wotreplay', body, contentType: 'application/octet-stream' });

    expect(client.send.mock.calls[0]?.[0]).toBeInstanceOf(PutObjectCommand);

    expect(client.send.mock.calls.map(([command]) => command.input)).toEqual([
      { Bucket: 'replays', Key: 'prod/a.wotreplay', Body: body, ContentType: 'application/octet-stream' }
    ]);
  });

  it('reads and removes the same prefixed key', async () => {
    const { client, storage } = createStorage();

    client.send.mockImplementation(async (command) =>
      command instanceof GetObjectCommand ? { Body: { transformToByteArray: async () => body } } : {}
    );

    expect(await storage.get('a.wotreplay')).toEqual(body);
    await storage.remove('a.wotreplay');

    expect(client.send.mock.calls[1]?.[0]).toBeInstanceOf(DeleteObjectCommand);

    expect(client.send.mock.calls.map(([command]) => command.input)).toEqual([
      expect.objectContaining({ Key: 'prod/a.wotreplay' }),
      expect.objectContaining({ Key: 'prod/a.wotreplay' })
    ]);
  });

  it('fails clearly on an object without a body', async () => {
    const { client, storage } = createStorage();

    client.send.mockImplementation(async () => ({}));

    await expect(storage.get('a.wotreplay')).rejects.toThrow('no body');
  });
});
