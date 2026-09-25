import { API_KEY } from '@bronevik/schemas';

import type { OpenApiParameter } from '@/shared/api/developer';

import type { BuildCurlExampleInput } from './curl-example.types';

import { CURL_EXAMPLE } from './curl-example.constants';

export const sampleValue = ({ name, schema }: Pick<OpenApiParameter, 'name' | 'schema'>): string => {
  const [first] = schema?.enum ?? [];

  if (first !== undefined) {
    return String(first);
  }

  return CURL_EXAMPLE.byName[name] ?? CURL_EXAMPLE.byType[schema?.type ?? ''] ?? CURL_EXAMPLE.fallback;
};

export const trimBaseUrl = (baseUrl: string) => baseUrl.replace(/\/+$/, '');

export const buildCurlExample = ({ baseUrl, method, path, parameters }: BuildCurlExampleInput): string => {
  const resolvedPath = path.replace(CURL_EXAMPLE.placeholder, (_, name: string) => {
    const parameter = parameters.find((item) => item.in === 'path' && item.name === name);

    return encodeURIComponent(sampleValue(parameter ?? { name }));
  });

  const query = new URLSearchParams(
    parameters.filter((parameter) => parameter.in === 'query' && parameter.required).map((parameter) => [parameter.name, sampleValue(parameter)])
  ).toString();

  const url = `${trimBaseUrl(baseUrl)}${resolvedPath}${query ? `?${query}` : ''}`;
  const verb = method === 'get' ? '' : `-X ${method.toUpperCase()} `;

  return [`curl ${verb}'${url}'`, `-H "${API_KEY.header}: ${CURL_EXAMPLE.keyVariable}"`].join(CURL_EXAMPLE.lineBreak);
};
