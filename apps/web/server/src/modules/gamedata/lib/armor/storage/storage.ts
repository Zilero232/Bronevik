import type { ArmorStorage } from './storage.types';

import { LocalDiskStorage } from '../../../../../core';

export const createArmorStorage = (root: string): ArmorStorage => new LocalDiskStorage(root);
