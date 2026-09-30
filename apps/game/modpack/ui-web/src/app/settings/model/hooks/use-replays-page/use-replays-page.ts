import { useStore } from '@nanostores/preact';
import { useEffect, useMemo } from 'preact/hooks';

import { REPLAYS } from '../../../../../entities/replays';
import { $components, $feed, toggleSwitch, unwatchFeed, watchFeed } from '../../../../../entities/window-state';

export const useReplaysPage = () => {
  const component = useStore($components).find(({ page }) => page?.kind === REPLAYS.pageKind) ?? null;
  const feed = useStore($feed);
  const componentId = component?.id ?? null;

  useEffect(() => {
    if (componentId === null) {
      return undefined;
    }

    watchFeed(componentId);

    return () => unwatchFeed(componentId);
  }, [componentId]);

  const page = useMemo(() => {
    if (feed?.component !== componentId) {
      return undefined;
    }

    return feed.page ? { ...feed.page, items: feed.items } : null;
  }, [feed, componentId]);

  return component ? { page, enabled: component.switch?.value ?? true, turnOn: () => toggleSwitch(component) } : null;
};
