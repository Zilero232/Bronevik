import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

import type { PutObjectInput, S3StorageOptions } from './storage.types';

import { ReplayStorage } from './replay-storage';

export class S3Storage extends ReplayStorage {
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor({ bucket, region, endpoint, accessKeyId, secretAccessKey }: S3StorageOptions) {
    super();
    this.bucket = bucket;

    this.client = new S3Client({
      region,
      ...(endpoint ? { endpoint, forcePathStyle: true } : {}),
      credentials: { accessKeyId, secretAccessKey }
    });
  }

  async put({ key, body, contentType }: PutObjectInput): Promise<void> {
    await this.client.send(new PutObjectCommand({ Bucket: this.bucket, Key: key, Body: body, ContentType: contentType }));
  }

  async get(key: string): Promise<Uint8Array> {
    const object = await this.client.send(new GetObjectCommand({ Bucket: this.bucket, Key: key }));

    if (!object.Body) {
      throw new Error(`Storage object ${key} has no body`);
    }

    return object.Body.transformToByteArray();
  }

  async remove(key: string): Promise<void> {
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
  }
}
