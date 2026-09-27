import type { ExecutionContext } from '@nestjs/common';
import type { UserSession } from '@thallesp/nestjs-better-auth';

import { CacheInterceptor } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';

import { CACHE_BY_VIEWER } from '../../cache';

@Injectable()
export class ViewerCacheInterceptor extends CacheInterceptor {
  protected async trackBy(context: ExecutionContext): Promise<string | null | undefined> {
    const key = await super.trackBy(context);
    const isByViewer = this.reflector.get<boolean | undefined>(CACHE_BY_VIEWER, context.getHandler()) ?? false;
    const userId = context.switchToHttp().getRequest<{ session?: UserSession | null }>().session?.user.id;

    if (!key || !isByViewer || !userId) {
      return key;
    }

    return `${key}:viewer:${userId}`;
  }
}
