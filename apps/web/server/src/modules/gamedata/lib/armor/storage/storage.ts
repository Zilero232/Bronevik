import type { ArmorStorage, ArmorStorageEnv } from './storage.types';

import { createObjectStorage } from '../../../../../core';

export const createArmorStorage = ({ ARMOR_STORAGE_DIR, ...env }: ArmorStorageEnv): ArmorStorage =>
  createObjectStorage({ env, root: ARMOR_STORAGE_DIR });
