import type { OpenApiOperation, OpenApiParameter } from '@/shared/api/developer';

import type { OPENAPI_ENDPOINTS } from './openapi-endpoints.constants';

export type HttpMethod = (typeof OPENAPI_ENDPOINTS.methods)[number];

export type ApiEndpointResponse = {
  status: string;
  description: string | null;
};

export type ApiEndpoint = {
  id: string;
  method: HttpMethod;
  path: string;
  operationId: string | null;
  summary: string | null;
  tag: string;
  parameters: OpenApiParameter[];
  responses: ApiEndpointResponse[];
};

export type EndpointGroup = {
  tag: string;
  label: string;
  endpoints: ApiEndpoint[];
};

export type ToEndpointInput = {
  path: string;
  method: HttpMethod;
  operation: OpenApiOperation;
  shared: OpenApiParameter[];
};

export type FilterEndpointGroupsInput = {
  groups: EndpointGroup[];
  query: string;
};

export type PathSegment = {
  text: string;
  isParam: boolean;
};
