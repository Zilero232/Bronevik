'use client';

import { NextIntlClientProvider } from 'next-intl';

import { mergePreviewConfig, OverlayBoard } from '@/entities/streamer/overlay';
import { messages, TIME_ZONE } from '@/shared/i18n';

import type { OverlayStageProps } from './OverlayStage.types';

export const OverlayStage = ({ data, patch }: OverlayStageProps) => {
  const config = mergePreviewConfig({ config: data.config, patch });

  return (
    <NextIntlClientProvider locale={config.locale} messages={messages[config.locale]} timeZone={TIME_ZONE}>
      <OverlayBoard config={config} data={data} />
    </NextIntlClientProvider>
  );
};
