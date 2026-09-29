import type { DynamicModule } from '@nestjs/common';

import { Module } from '@nestjs/common';

import type { ObjectStorageModuleOptions } from './storage.types';

import { LocalDiskStorage } from './local-disk.storage';
import { ObjectStorage } from './object-storage';

@Module({})
export class ObjectStorageModule {
  static register({ root }: ObjectStorageModuleOptions): DynamicModule {
    const provider = { provide: ObjectStorage, useFactory: () => new LocalDiskStorage(root) };

    return { module: ObjectStorageModule, providers: [provider], exports: [provider] };
  }
}
