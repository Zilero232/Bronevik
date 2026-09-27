import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

import type { ConsumeOAuthStateInput, IssuedOAuthState, OAuthStateInput } from '../streamers.types';

import { REDIS } from '../../../core';
import { OAUTH_STATE } from '../config';
import { oauthStateSchema } from '../dto/streamers.schemas';

@Injectable()
export class OAuthStateService {
  constructor(@Inject(REDIS) private readonly redis: Redis) {}

  async create({ provider, userId }: OAuthStateInput): Promise<IssuedOAuthState> {
    const state = randomBytes(OAUTH_STATE.bytes).toString('base64url');
    const binding = randomBytes(OAUTH_STATE.bytes).toString('base64url');

    await this.redis.set(
      `${OAUTH_STATE.prefix}${state}`,
      JSON.stringify({ provider, userId, binding: this.digest(binding) }),
      'EX',
      OAUTH_STATE.ttlSeconds
    );

    return { state, binding };
  }

  async consume({ state, binding }: ConsumeOAuthStateInput): Promise<OAuthStateInput | null> {
    const raw = await this.redis.getdel(`${OAUTH_STATE.prefix}${state}`);

    if (!raw || !binding) {
      return null;
    }

    const parsed = oauthStateSchema.safeParse(raw);

    if (!parsed.success) {
      return null;
    }

    const expected = Buffer.from(parsed.data.binding, 'hex');
    const actual = Buffer.from(this.digest(binding), 'hex');

    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
      return null;
    }

    return { provider: parsed.data.provider, userId: parsed.data.userId };
  }

  private digest(binding: string): string {
    return createHash('sha256').update(binding).digest('hex');
  }
}
