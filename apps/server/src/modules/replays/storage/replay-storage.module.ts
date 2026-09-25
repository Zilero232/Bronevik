import { Module } from '@nestjs/common';

import { AppConfigService } from '../../../config';
import { ReplayStorage } from './replay-storage';
import { createReplayStorage } from './replay-storage.factory';

const storageProvider = {
  provide: ReplayStorage,
  inject: [AppConfigService],
  useFactory: (config: AppConfigService) =>
    createReplayStorage({
      REPLAY_STORAGE: config.get('REPLAY_STORAGE'),
      REPLAY_STORAGE_DIR: config.get('REPLAY_STORAGE_DIR'),
      S3_ENDPOINT: config.get('S3_ENDPOINT'),
      S3_REGION: config.get('S3_REGION'),
      S3_BUCKET: config.get('S3_BUCKET'),
      S3_ACCESS_KEY_ID: config.get('S3_ACCESS_KEY_ID'),
      S3_SECRET_ACCESS_KEY: config.get('S3_SECRET_ACCESS_KEY')
    })
};

@Module({
  providers: [storageProvider],
  exports: [storageProvider]
})
export class ReplayStorageModule {}
