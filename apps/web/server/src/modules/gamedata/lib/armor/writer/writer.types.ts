import type { PrismaClient } from '../../../../../../generated';
import type { CollectedArmorModels } from '../collect';
import type { ArmorStorage } from '../storage';

export type WriteArmorModelsInput = {
  prisma: PrismaClient;
  storage: ArmorStorage;
  collected: CollectedArmorModels;
  onProgress?: (message: string) => void;
};

export type ArmorWriteCounts = {
  uploaded: number;
  unchanged: number;
  replaced: number;
};

export type PurgeArmorModelsInput = {
  prisma: PrismaClient;
  storage: ArmorStorage;
};
