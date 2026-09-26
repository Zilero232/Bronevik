'use client';

import type { PreviewOverlayInput } from '@bronevik/schemas';

import { previewOverlaySchema } from '@bronevik/schemas';
import { useDebounceValue } from '@siberiacancode/reactuse';
import { keepPreviousData, skipToken, useQuery } from '@tanstack/react-query';
import { useFormContext, useWatch } from 'react-hook-form';

import { previewOverlay } from '@/shared/api/streamers';
import { QUERY_KEYS } from '@/shared/constants';

import type { OverlayFormValues } from '../../../lib/overlay-form';
import type { UseOverlayPreviewInput } from './use-overlay-preview.types';

import { OVERLAY_EDITOR } from '../../../config';

export const useOverlayPreview = ({ accountId }: UseOverlayPreviewInput) => {
  const { control } = useFormContext<OverlayFormValues>();
  const [kind, config, name] = useWatch({ control, name: ['kind', 'config', 'name'] });
  const serialized = useDebounceValue(JSON.stringify({ kind, config, name, accountId: accountId ?? undefined }), OVERLAY_EDITOR.previewDebounceMs);

  const parsed = previewOverlaySchema.safeParse(JSON.parse(serialized));
  const input: PreviewOverlayInput | null = parsed.success ? parsed.data : null;

  const query = useQuery({
    queryKey: [...QUERY_KEYS.me.streamer.overlays, 'preview', input],
    queryFn: input ? () => previewOverlay(input) : skipToken,
    placeholderData: keepPreviousData
  });

  const onRetry = () => void query.refetch();

  return {
    data: query.data,
    config,
    isError: query.isError,
    isFetching: query.isFetching,
    onRetry
  };
};
