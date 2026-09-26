import type { OverlayConfig } from '@otmetki/schemas';

import { overlayConfigSchema } from '@otmetki/schemas';
import { isPlainObject, pickBy } from 'remeda';

import type { MergePreviewConfigInput, OverlayConfigPatch } from './preview-config.types';

const patchSchema = overlayConfigSchema.partial();

const toBase64Url = (text: string) => {
  const binary = Array.from(new TextEncoder().encode(text), (byte) => String.fromCharCode(byte)).join('');

  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/u, '');
};

const fromBase64Url = (value: string) => {
  const base64 = value.replaceAll('-', '+').replaceAll('_', '/');
  const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='));

  return new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)));
};

const readJson = (value: string): unknown => {
  try {
    return JSON.parse(fromBase64Url(value));
  } catch {
    return null;
  }
};

export const encodePreviewConfig = (config: OverlayConfigPatch): string => toBase64Url(JSON.stringify(config));

export const decodePreviewConfig = (value: string | null | undefined): OverlayConfigPatch | null => {
  if (!value) {
    return null;
  }

  const raw = readJson(value);
  const parsed = patchSchema.safeParse(raw);

  if (!parsed.success || !isPlainObject(raw)) {
    return null;
  }

  return pickBy(parsed.data, (_, key) => key in raw);
};

export const mergePreviewConfig = ({ config, patch }: MergePreviewConfigInput): OverlayConfig => (patch ? { ...config, ...patch } : config);
