import { Injectable } from '@nestjs/common';

import type { HttpGetInput } from './http.types';

import { http } from '../../lib/http';

@Injectable()
export class HttpClientService {
  getText({ url, options }: HttpGetInput): Promise<string> {
    return http.get(url, options).text();
  }

  getJson({ url, options }: HttpGetInput): Promise<unknown> {
    return http.get(url, options).json();
  }
}
