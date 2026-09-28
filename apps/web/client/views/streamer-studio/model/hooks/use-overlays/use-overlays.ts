'use client';

import { useMutation, useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';

import type { SaveOverlayInput } from '../../studio.types';

import { createOverlay, getOverlays, removeOverlay, updateOverlay } from '../../../api';

const saveOverlay = ({ id, values }: SaveOverlayInput) => (id ? updateOverlay({ id, ...values }) : createOverlay(values));

export const useOverlays = () => useQuery({ queryKey: QUERY_KEYS.me.streamer.overlays, queryFn: getOverlays });

export const useSaveOverlay = () =>
  useMutation({
    mutationFn: saveOverlay,
    meta: {
      successKey: 'streamer.studio.toast.overlaySaved',
      errorKey: 'streamer.studio.toast.failed',
      invalidates: [QUERY_KEYS.me.streamer.overlays]
    }
  });

export const useRemoveOverlay = () =>
  useMutation({
    mutationFn: removeOverlay,
    meta: {
      successKey: 'streamer.studio.toast.overlayRemoved',
      errorKey: 'streamer.studio.toast.failed',
      invalidates: [QUERY_KEYS.me.streamer.overlays]
    }
  });
