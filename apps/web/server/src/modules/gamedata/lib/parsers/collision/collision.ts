import type { CollisionFile, ModelIndex } from './collision.types';

import { collisionSchema, modelIndexSchema } from './collision.schemas';

export const parseCollision = (json: string): CollisionFile => collisionSchema.parse(JSON.parse(json));

export const parseModelIndex = (json: string): ModelIndex => modelIndexSchema.parse(JSON.parse(json));
