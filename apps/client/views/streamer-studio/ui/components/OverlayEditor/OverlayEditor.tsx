'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Trash2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { FormProvider, useForm, useWatch } from 'react-hook-form';

import { Button } from '@/ui-kit';

import type { OverlayFormValues } from '../../../lib/overlay-form';
import type { OverlayEditorProps } from './OverlayEditor.types';

import { overlayFormSchema, toOverlayFormValues } from '../../../lib/overlay-form';
import { useRemoveOverlay, useSaveOverlay } from '../../../model/hooks';
import { ConfirmAction } from '../ConfirmAction';
import { OverlayBasicsFields } from '../OverlayBasicsFields';
import { OverlayMetricsField } from '../OverlayMetricsField';
import { OverlayObsHint } from '../OverlayObsHint';
import { OverlayPreview } from '../OverlayPreview';
import { OverlayStyleFields } from '../OverlayStyleFields';
import { OverlayTogglesFields } from '../OverlayTogglesFields';

import s from './OverlayEditor.module.scss';

export const OverlayEditor = ({ overlay, previewPublicId, onSaved, onRemoved }: OverlayEditorProps) => {
  const t = useTranslations('streamer.overlays');
  const locale = useLocale();
  const save = useSaveOverlay();
  const remove = useRemoveOverlay();
  const form = useForm<OverlayFormValues>({
    resolver: zodResolver(overlayFormSchema),
    defaultValues: toOverlayFormValues({ overlay, locale, name: t('defaultName') })
  });

  const config = useWatch({ control: form.control, name: 'config' });

  const onSubmit = form.handleSubmit((values) => save.mutate({ id: overlay?.id ?? null, values }, { onSuccess: ({ id }) => onSaved(id) }));

  return (
    <FormProvider {...form}>
      <form noValidate className={s.root} onSubmit={onSubmit}>
        <div className={s.controls}>
          <OverlayBasicsFields />
          <OverlayMetricsField />
          <OverlayStyleFields />
          <OverlayTogglesFields />
          <footer className={s.footer}>
            <Button disabled={save.isPending} type='submit'>
              <Save size={16} />
              {overlay ? t('save') : t('create')}
            </Button>
            {overlay && (
              <ConfirmAction
                confirmLabel={t('remove')}
                description={t('removeDescription', { name: overlay.name })}
                icon={<Trash2 size={14} />}
                isPending={remove.isPending}
                title={t('removeTitle')}
                triggerLabel={t('remove')}
                onConfirm={() => remove.mutate(overlay.id, { onSuccess: onRemoved })}
              />
            )}
          </footer>
        </div>
        <div className={s.stage}>
          <OverlayPreview config={config} isDraft={!overlay} publicId={previewPublicId} />
          {overlay && <OverlayObsHint layout={config.layout} publicUrl={overlay.publicUrl} />}
        </div>
      </form>
    </FormProvider>
  );
};
