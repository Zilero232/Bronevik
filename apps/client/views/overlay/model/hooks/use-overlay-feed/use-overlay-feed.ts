'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useReducer } from 'react';

import { getOverlayData, STREAMERS_PATHS } from '@/shared/api/streamers';
import { env } from '@/shared/config';
import { QUERY_KEYS } from '@/shared/constants';

import type { UseOverlayFeedInput } from './use-overlay-feed.types';

import { OVERLAY_FEED } from '../../../config';
import { feedReducer, initialFeedState } from '../../../lib/feed-state';

export const useOverlayFeed = ({ publicId, isEnabled }: UseOverlayFeedInput) => {
  const [{ transport, data: streamed }, dispatch] = useReducer(feedReducer, env.NEXT_PUBLIC_USE_MOCKS, initialFeedState);

  const isPolling = transport === 'polling';

  const { data: polled, isError } = useQuery({
    queryKey: QUERY_KEYS.streamers.overlay(publicId),
    queryFn: () => getOverlayData(publicId),
    enabled: isEnabled,
    refetchInterval: isPolling ? OVERLAY_FEED.pollMs : false,
    retry: OVERLAY_FEED.retries
  });

  useEffect(() => {
    if (!isEnabled || transport !== 'stream') {
      return;
    }

    const source = new EventSource(`${env.NEXT_PUBLIC_API_URL}${STREAMERS_PATHS.overlayStream(publicId)}`);

    source.onmessage = (event: MessageEvent<string>) => dispatch({ type: 'message', payload: event.data });

    source.onerror = () => {
      source.close();
      dispatch({ type: 'error' });
    };

    return () => source.close();
  }, [isEnabled, publicId, transport]);

  const data = isPolling ? (polled ?? streamed) : (streamed ?? polled);

  return { data: data ?? null, isError: isError && !data };
};
