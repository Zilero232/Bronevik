import { overlayConfigSchema } from '@bronevik/schemas';

import type { OverlayFormValues, ToOverlayFormValuesInput } from './overlay-form.types';

import { KIND_PRESETS } from '../../config';

export const toOverlayFormValues = ({ overlay, locale, name }: ToOverlayFormValuesInput): OverlayFormValues => {
  if (overlay) {
    return { name: overlay.name, kind: overlay.kind, config: overlay.config };
  }

  return { name, kind: 'session', config: overlayConfigSchema.parse({ metrics: [...KIND_PRESETS.session], locale }) };
};

export const publicIdOf = (publicUrl: string): string | null => {
  try {
    return new URL(publicUrl).pathname.split('/').filter(Boolean).at(-1) ?? null;
  } catch {
    return null;
  }
};
