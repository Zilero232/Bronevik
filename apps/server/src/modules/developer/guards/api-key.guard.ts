import type { CanActivate, ExecutionContext } from '@nestjs/common';
import type { Response } from 'express';

import { API_KEY } from '@bronevik/schemas';
import { Injectable } from '@nestjs/common';

import type { ApiRequest } from '../developer.types';

import { AppTooManyRequestsException, AppUnauthorizedException } from '../../../common/exceptions';
import { API_RATE_LIMIT } from '../config';
import { endpointLabel } from '../lib';
import { ApiKeysService, ApiRateLimitService, ApiUsageService } from '../services';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly keys: ApiKeysService,
    private readonly limits: ApiRateLimitService,
    private readonly usage: ApiUsageService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp();
    const request = http.getRequest<ApiRequest>();
    const response = http.getResponse<Response>();
    const raw = request.header(API_KEY.header);

    if (!raw) {
      throw new AppUnauthorizedException('API_KEY_INVALID', `Pass your API key in the ${API_KEY.header} header`);
    }

    const key = await this.keys.authenticate(raw);

    try {
      const state = await this.limits.consume(key);

      response.setHeader(API_RATE_LIMIT.headers.limit, state.limit);
      response.setHeader(API_RATE_LIMIT.headers.remaining, state.remaining);
      response.setHeader(API_RATE_LIMIT.headers.dailyLimit, state.dailyLimit);
      response.setHeader(API_RATE_LIMIT.headers.dailyRemaining, state.dailyRemaining);
    } catch (error) {
      if (error instanceof AppTooManyRequestsException) {
        this.usage.recordThrottled({ keyId: key.id, endpoint: endpointLabel({ method: request.method, route: request.route?.path }) });

        if (error.retryAfterSec !== null) {
          response.setHeader(API_RATE_LIMIT.headers.retryAfter, error.retryAfterSec);
        }
      }

      throw error;
    }

    request.apiKey = key;

    return true;
  }
}
