import { groupBy, uniqueBy } from 'remeda';

import type { OpenApiDocument, OpenApiParameter } from '@/shared/api/developer';

import { openApiOperationSchema } from '@/shared/api/developer';

import type { ApiEndpoint, EndpointGroup, FilterEndpointGroupsInput, PathSegment, ToEndpointInput } from './openapi-endpoints.types';

import { OPENAPI_ENDPOINTS } from './openapi-endpoints.constants';

const sharedParameters = (value: unknown): OpenApiParameter[] => {
  const parsed = openApiOperationSchema.shape.parameters.safeParse(value);

  return parsed.success ? (parsed.data ?? []) : [];
};

const toEndpoint = ({ path, method, operation, shared }: ToEndpointInput): ApiEndpoint => ({
  id: `${method} ${path}`,
  method,
  path,
  operationId: operation.operationId ?? null,
  summary: operation.summary || operation.description || null,
  tag: operation.tags?.[0] ?? OPENAPI_ENDPOINTS.fallbackTag,
  parameters: uniqueBy([...(operation.parameters ?? []), ...shared], (parameter) => `${parameter.in}:${parameter.name}`),
  responses: Object.entries(operation.responses ?? {}).map(([status, { description }]) => ({ status, description: description || null }))
});

export const tagLabel = (tag: string) => tag.replace(OPENAPI_ENDPOINTS.versionPrefix, '');

export const groupEndpoints = (spec: OpenApiDocument): EndpointGroup[] => {
  const endpoints = Object.entries(spec.paths).flatMap(([path, item]) => {
    const shared = sharedParameters(item.parameters);

    return OPENAPI_ENDPOINTS.methods.flatMap((method) => {
      const parsed = openApiOperationSchema.safeParse(item[method]);

      return parsed.success ? [toEndpoint({ path, method, operation: parsed.data, shared })] : [];
    });
  });

  return Object.entries(groupBy(endpoints, ({ tag }) => tag)).map(([tag, items]) => ({ tag, label: tagLabel(tag), endpoints: items }));
};

const haystack = ({ method, path, summary, operationId, tag }: ApiEndpoint) =>
  [method, path, summary ?? '', operationId ?? '', tagLabel(tag)].join(' ').toLowerCase();

export const filterEndpointGroups = ({ groups, query }: FilterEndpointGroupsInput): EndpointGroup[] => {
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

  if (tokens.length === 0) {
    return groups;
  }

  return groups
    .map((group) => ({ ...group, endpoints: group.endpoints.filter((endpoint) => tokens.every((token) => haystack(endpoint).includes(token))) }))
    .filter(({ endpoints }) => endpoints.length > 0);
};

export const pathSegments = (path: string): PathSegment[] =>
  path
    .split(OPENAPI_ENDPOINTS.param)
    .filter(Boolean)
    .map((text) => ({ text, isParam: text.startsWith('{') && text.endsWith('}') }));
