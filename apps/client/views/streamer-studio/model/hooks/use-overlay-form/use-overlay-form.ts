'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { useForm, useWatch } from 'react-hook-form';

import type { OverlayFormValues } from '../../../lib/overlay-form';
import type { UseOverlayFormInput } from './use-overlay-form.types';

import { overlayFormSchema, toOverlayFormValues } from '../../../lib/overlay-form';
import { useRemoveOverlay, useSaveOverlay } from '../use-overlays';

export const useOverlayForm = ({ overlay, onSaved, onRemoved }: UseOverlayFormInput) => {
  const t = useTranslations('streamer.overlays');
  const locale = useLocale();
  const save = useSaveOverlay();
  const remove = useRemoveOverlay();
  const form = useForm<OverlayFormValues>({
    resolver: zodResolver(overlayFormSchema),
    defaultValues: toOverlayFormValues({ overlay, locale, name: t('defaultName') })
  });

  const layout = useWatch({ control: form.control, name: 'config.layout' });

  const onSubmit = form.handleSubmit((values) => save.mutate({ id: overlay?.id ?? null, values }, { onSuccess: ({ id }) => onSaved(id) }));

  const onRemove = () => {
    if (overlay) {
      remove.mutate(overlay.id, { onSuccess: onRemoved });
    }
  };

  return { form, layout, isSaving: save.isPending, isRemoving: remove.isPending, onSubmit, onRemove };
};
