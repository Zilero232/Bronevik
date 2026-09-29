import type { ObjectStorage } from '../../../../../core';

export type ArmorStorage = Pick<ObjectStorage, 'get' | 'put' | 'remove'>;
