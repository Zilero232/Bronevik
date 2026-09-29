import { useLayoutEffect, useRef, useState } from 'preact/hooks';

import type { Measured } from '../../../lib/panel-size';
import type { MeasureRef, Sizes, UsePanelSizesInput } from './use-panel-sizes.types';

import { rootScale } from '../../../../../shared/lib/hud-screen';
import { sameSize, stickySize } from '../../../lib/panel-size';
import { widgetLines } from '../../../lib/widget-registry';

export const usePanelSizes = ({ lines, widgets }: UsePanelSizesInput) => {
  const [sizes, setSizes] = useState<Sizes>({});
  const elementsRef = useRef(new Map<string, HTMLElement>());
  const measureRefsRef = useRef(new Map<string, MeasureRef>());

  useLayoutEffect(() => {
    const scale = rootScale();
    const measured: Sizes = {};
    let changed = false;

    elementsRef.current.forEach((element, id) => {
      const resolved = widgets.get(id);
      const count = resolved ? widgetLines(resolved) : (lines.get(id)?.length ?? 0);
      const next: Measured = { lines: count, width: element.offsetWidth / scale, height: element.offsetHeight / scale };
      const size = stickySize({ previous: sizes[id], next });

      measured[id] = size;
      changed = changed || !sameSize(sizes[id], size);
    });

    if (changed || Object.keys(sizes).length !== Object.keys(measured).length) {
      // eslint-disable-next-line react/set-state-in-effect -- the labels' sizes are only known after layout; it settles once nothing grows
      setSizes(measured);
    }
  }, [lines, widgets, sizes]);

  const measureRef = (id: string): MeasureRef => {
    const known = measureRefsRef.current.get(id);

    if (known) {
      return known;
    }

    const callback: MeasureRef = (element) => {
      if (element) {
        elementsRef.current.set(id, element);
      } else {
        elementsRef.current.delete(id);
      }
    };

    measureRefsRef.current.set(id, callback);

    return callback;
  };

  return { sizes, measureRef };
};
