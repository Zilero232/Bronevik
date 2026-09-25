import type { OpenApiParameter } from '@/shared/api/developer';

import type { HttpMethod } from '../openapi-endpoints';

export type BuildCurlExampleInput = {
  baseUrl: string;
  method: HttpMethod;
  path: string;
  parameters: OpenApiParameter[];
};

export type CurlExampleConfig = {
  keyVariable: string;
  placeholder: RegExp;
  fallback: string;
  byType: Partial<Record<string, string>>;
  byName: Partial<Record<string, string>>;
  lineBreak: string;
};
