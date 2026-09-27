import type { Configuration } from '@hocuspocus/extension-redis';
import type { Extension } from '@hocuspocus/server';

import { Redis as RedisExtension } from '@hocuspocus/extension-redis';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CollabRedisService {
  createExtension(configuration: Partial<Configuration>): Extension {
    return new RedisExtension(configuration);
  }
}
