import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

import type { PutObjectInput, S3Sender, S3StorageOptions } from './storage.types';

import { ObjectStorage } from './object-storage';

export class S3Storage extends ObjectStorage {
  private readonly client: S3Sender;
  private readonly bucket: string;
  private readonly prefix: string;

  constructor({ bucket, prefix, region, endpoint, accessKeyId, secretAccessKey, client }: S3StorageOptions) {
    super();
    this.bucket = bucket;
    this.prefix = prefix;

    this.client =
      client ??
      new S3Client({
        region,
        ...(endpoint ? { endpoint, forcePathStyle: true } : {}),
        credentials: { accessKeyId, secretAccessKey }
      });
  }

  async put({ key, body, contentType }: PutObjectInput): Promise<void> {
    await this.client.send(new PutObjectCommand({ Bucket: this.bucket, Key: this.keyOf(key), Body: body, ContentType: contentType }));
  }

  async get(key: string): Promise<Uint8Array> {
    const object = await this.client.send(new GetObjectCommand({ Bucket: this.bucket, Key: this.keyOf(key) }));

    if (!object.Body) {
      throw new Error(`Storage object ${key} has no body`);
    }

    return object.Body.transformToByteArray();
  }

  async remove(key: string): Promise<void> {
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: this.keyOf(key) }));
  }

  private keyOf(key: string): string {
    return `${this.prefix}${key}`;
  }
}
