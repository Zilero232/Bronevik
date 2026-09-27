import { AppConfigService, ARMOR_VIEWER } from '../../../config';
import { createArmorStorage } from '../../gamedata';
import { ARMOR_STORAGE } from '../config';

export const armorStorageProvider = {
  provide: ARMOR_STORAGE,
  inject: [AppConfigService],
  useFactory: (config: AppConfigService) =>
    createArmorStorage({
      REPLAY_STORAGE: config.get('REPLAY_STORAGE'),
      ARMOR_STORAGE_DIR: ARMOR_VIEWER.storageDir,
      S3_ENDPOINT: config.get('S3_ENDPOINT'),
      S3_REGION: config.get('S3_REGION'),
      S3_BUCKET: config.get('S3_BUCKET'),
      S3_ACCESS_KEY_ID: config.get('S3_ACCESS_KEY_ID'),
      S3_SECRET_ACCESS_KEY: config.get('S3_SECRET_ACCESS_KEY')
    })
};
