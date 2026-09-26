import type { DynamicModule } from '@nestjs/common';

import { Module } from '@nestjs/common';

import type { ObjectStorageModuleOptions } from './storage.types';

import { AppConfigService } from '../../config';
import { ObjectStorage } from './object-storage';
import { createObjectStorage } from './storage.factory';

@Module({})
export class ObjectStorageModule {
  static register({ rootEnv, prefix }: ObjectStorageModuleOptions): DynamicModule {
    const provider = {
      provide: ObjectStorage,
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) =>
        createObjectStorage({
          root: config.get(rootEnv),
          prefix,
          env: {
            REPLAY_STORAGE: config.get('REPLAY_STORAGE'),
            S3_ENDPOINT: config.get('S3_ENDPOINT'),
            S3_REGION: config.get('S3_REGION'),
            S3_BUCKET: config.get('S3_BUCKET'),
            S3_ACCESS_KEY_ID: config.get('S3_ACCESS_KEY_ID'),
            S3_SECRET_ACCESS_KEY: config.get('S3_SECRET_ACCESS_KEY')
          }
        })
    };

    return { module: ObjectStorageModule, providers: [provider], exports: [provider] };
  }
}
