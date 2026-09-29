import type { OverlayConfig } from '@otmetki/schemas';

import { overlayConfigSchema } from '@otmetki/schemas';
import { isPlainObject, pickBy } from 'remeda';
import { base64ToString, stringToBase64 } from 'uint8array-extras';

import type { MergePreviewConfigInput, OverlayConfigPatch } from './preview-config.types';

const patchSchema = overlayConfigSchema.partial();

const readJson = (value: string): unknown => {
  try {
    return JSON.parse(base64ToString(value));
  } catch {
    return null;
  }
};

export const encodePreviewConfig = (config: OverlayConfigPatch): string => stringToBase64(JSON.stringify(config), { urlSafe: true });

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
