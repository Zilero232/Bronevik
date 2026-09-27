'use client';

import { useReplayColumns } from '../use-replay-columns';
import { useReplayVehicle } from '../use-replay-vehicle';
import { useReplaysFeed } from '../use-replays-feed';

export const useReplayBrowser = () => {
  const feed = useReplaysFeed();
  const columns = useReplayColumns();
  const vehicleOf = useReplayVehicle();

  return { ...feed, columns, vehicleOf, isPaging: feed.query.isFetching };
};
