import { Injectable } from '@nestjs/common';

import type { HttpRequestInput } from './http.types';

import { http } from '../../lib/http';

@Injectable()
export class HttpClientService {
  getText({ url, options }: HttpRequestInput): Promise<string> {
    return http.get(url, options).text();
  }

  getJson({ url, options }: HttpRequestInput): Promise<unknown> {
    return http.get(url, options).json();
  }

  requestJson({ url, options }: HttpRequestInput): Promise<unknown> {
    return http(url, options).json();
  }
}
