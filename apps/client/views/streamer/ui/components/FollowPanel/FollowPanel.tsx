'use client';

import { FollowStreamer } from '@/features/streamer/follow-streamer';

import type { FollowPanelProps } from './FollowPanel.types';

import { FollowExtras } from './components';

export const FollowPanel = ({ slug }: FollowPanelProps) => <FollowStreamer renderExtras={(state) => <FollowExtras state={state} />} slug={slug} />;
