import type { Overlay } from '@bronevik/schemas';
import type { z } from 'zod';

import type { overlayFormSchema } from './overlay-form.schemas';

export type OverlayFormValues = z.infer<typeof overlayFormSchema>;

export type ToOverlayFormValuesInput = {
  overlay: Overlay | null;
  locale: OverlayFormValues['config']['locale'];
  name: string;
};
