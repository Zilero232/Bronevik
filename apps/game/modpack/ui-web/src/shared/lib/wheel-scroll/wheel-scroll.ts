import { clamp } from 'remeda';

import type {
  BindWheelScrollInput,
  ScrollByWheelInput,
  Thumb,
  ThumbInput,
  TopFromThumbInput,
  WheelDelta,
  WheelRoot,
  WheelScrollInput
} from './wheel-scroll.types';

import { gameface } from '../../api/gameface';
import { SCROLL_AREA } from '../../config';
import { rootScale } from '../hud-screen';
import { reportOnce } from '../page-diag';

const maxTop = (content: number, viewport: number): number => Math.max(content - viewport, 0);

export const wheelScroll = ({ top, deltaY, max, step }: WheelScrollInput): number =>
  clamp(top + Math.sign(deltaY) * step, { min: 0, max: Math.max(max, 0) });

export const thumbOf = ({ top, content, viewport, minThumb }: ThumbInput): Thumb => {
  const max = maxTop(content, viewport);

  if (max <= 0 || viewport <= 0) {
    return { visible: false, size: 0, offset: 0 };
  }

  const size = Math.min(Math.max((viewport / content) * viewport, minThumb), viewport);

  return { visible: true, size, offset: (clamp(top, { min: 0, max }) / max) * (viewport - size) };
};

export const topFromThumb = ({ offset, size, content, viewport }: TopFromThumbInput): number => {
  const max = maxTop(content, viewport);
  const track = viewport - size;

  return track > 0 ? clamp((offset / track) * max, { min: 0, max }) : 0;
};

export const wheelDelta = (event: WheelDelta): number => {
  if (Number.isFinite(event.deltaY) && event.deltaY !== 0) {
    return event.deltaY;
  }

  const legacy = event.wheelDeltaY ?? event.wheelDelta ?? 0;

  return legacy === 0 ? 0 : -legacy;
};

const stepPx = (): number => SCROLL_AREA.step * (gameface.remScale() ?? rootScale());

export const scrollByWheel = ({ element, event, step = stepPx() }: ScrollByWheelInput): boolean => {
  const top = element.scrollTop;
  const next = wheelScroll({ top, deltaY: wheelDelta(event), max: element.scrollHeight - element.clientHeight, step });

  event.preventDefault();

  if (next === top) {
    return false;
  }

  event.stopPropagation();
  element.scrollTop = next;

  return true;
};

export const bindWheelScroll = ({ element, onScrolled }: BindWheelScrollInput): (() => void) => {
  const listener = (event: WheelEvent): void => {
    const moved = scrollByWheel({ element, event });

    reportOnce({
      kind: 'wheel',
      text: `delta ${wheelDelta(event)} (deltaY ${event.deltaY}), box ${element.scrollHeight}/${element.clientHeight} px, ${moved ? `scrolled to ${element.scrollTop}` : 'at its end'}`
    });

    if (moved) {
      onScrolled?.();
    }
  };

  element.addEventListener('wheel', listener, { passive: false });

  return () => element.removeEventListener('wheel', listener);
};

export const blockPageWheel = (root: WheelRoot): (() => void) => {
  const listener = (event: WheelEvent): void => {
    event.preventDefault();
  };

  root.addEventListener('wheel', listener, { passive: false });

  return () => root.removeEventListener('wheel', listener);
};
