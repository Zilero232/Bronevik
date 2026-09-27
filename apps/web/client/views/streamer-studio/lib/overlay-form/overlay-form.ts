import { overlayConfigSchema } from '@otmetki/schemas';

import type { OverlayFormValues, ToOverlayFormValuesInput } from './overlay-form.types';

import { KIND_PRESETS } from '../../config';

export const toOverlayFormValues = ({ overlay, locale, name }: ToOverlayFormValuesInput): OverlayFormValues => {
  if (overlay) {
    return { name: overlay.name, kind: overlay.kind, config: overlay.config };
  }

  return { name, kind: 'session', config: overlayConfigSchema.parse({ metrics: [...KIND_PRESETS.session], locale }) };
};
