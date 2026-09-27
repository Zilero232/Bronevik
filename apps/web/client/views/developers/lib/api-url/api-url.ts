import type { ApiUrlInput } from './api-url.types';

export const trimBaseUrl = (baseUrl: string) => baseUrl.replace(/\/+$/, '');

export const apiUrl = ({ baseUrl, path }: ApiUrlInput) => `${trimBaseUrl(baseUrl)}/${path.replace(/^\/+/, '')}`;

export const apiVersion = (path: string) => path.split('/').find(Boolean) ?? '';
