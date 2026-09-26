'use client';

import { useQuery } from '@tanstack/react-query';

import { createOverlay, getOverlays, removeOverlay, updateOverlay } from '@/shared/api/streamers';
import { QUERY_KEYS } from '@/shared/constants';

import type { SaveOverlayInput } from '../../studio.types';

import { useStudioMutation } from '../use-studio-mutation';

const saveOverlay = ({ id, values }: SaveOverlayInput) => (id ? updateOverlay({ id, ...values }) : createOverlay(values));

export const useOverlays = () => useQuery({ queryKey: QUERY_KEYS.me.streamer.overlays, queryFn: getOverlays });

export const useSaveOverlay = () =>
  useStudioMutation({ mutationFn: saveOverlay, queryKey: QUERY_KEYS.me.streamer.overlays, successKey: 'overlaySaved' });

export const useRemoveOverlay = () =>
  useStudioMutation({ mutationFn: removeOverlay, queryKey: QUERY_KEYS.me.streamer.overlays, successKey: 'overlayRemoved' });
