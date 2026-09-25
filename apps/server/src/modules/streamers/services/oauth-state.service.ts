import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { randomBytes } from 'node:crypto';

import type { OAuthStateInput } from '../streamers.types';

import { REDIS } from '../../../core';
import { OAUTH_STATE } from '../config';
import { oauthStateSchema } from '../dto/streamers.schemas';

@Injectable()
export class OAuthStateService {
  constructor(@Inject(REDIS) private readonly redis: Redis) {}

  async create({ provider, userId }: OAuthStateInput): Promise<string> {
    const state = randomBytes(OAUTH_STATE.bytes).toString('base64url');

    await this.redis.set(`${OAUTH_STATE.prefix}${state}`, JSON.stringify({ provider, userId }), 'EX', OAUTH_STATE.ttlSeconds);

    return state;
  }

  async consume(state: string): Promise<OAuthStateInput | null> {
    const raw = await this.redis.getdel(`${OAUTH_STATE.prefix}${state}`);

    if (!raw) {
      return null;
    }

    const parsed = oauthStateSchema.safeParse(raw);

    return parsed.success ? parsed.data : null;
  }
}
