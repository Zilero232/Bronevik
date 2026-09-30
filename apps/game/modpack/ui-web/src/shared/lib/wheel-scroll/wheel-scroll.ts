import { clamp } from 'remeda';

import type { ScrollByWheelInput, Thumb, ThumbInput, TopFromThumbInput, WheelScrollInput, WheelTargetInput } from './wheel-scroll.types';

import { SCROLL_AREA } from '../../config';
import { rootScale } from '../hud-screen';

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

export const scrollByWheel = ({ element, event }: ScrollByWheelInput): boolean => {
  const top = element.scrollTop;
  const next = wheelScroll({ top, deltaY: event.deltaY, max: element.scrollHeight - element.clientHeight, step: SCROLL_AREA.step * rootScale() });

  event.preventDefault();

  if (next === top) {
    return false;
  }

  event.stopPropagation();
  element.scrollTop = next;

  return true;
};

const scrollsItself = (element: HTMLElement): boolean => {
  const overflow: readonly string[] = SCROLL_AREA.scrollable;

  return element.hasAttribute(SCROLL_AREA.attribute) || overflow.includes(getComputedStyle(element).overflowY);
};

const canMove = (element: HTMLElement, deltaY: number): boolean =>
  deltaY < 0 ? element.scrollTop > 0 : element.scrollTop < element.scrollHeight - element.clientHeight;

export const wheelTarget = ({ start, deltaY }: WheelTargetInput): HTMLElement | null => {
  for (let element = start instanceof HTMLElement ? start : (start?.parentElement ?? null); element; element = element.parentElement) {
    if (deltaY !== 0 && scrollsItself(element) && canMove(element, deltaY)) {
      return element;
    }
  }

  return null;
};

export const bindWheelScroll = (root: Pick<Document, 'addEventListener' | 'removeEventListener'>): (() => void) => {
  const listener = (event: WheelEvent): void => {
    const target = event.target instanceof Element ? event.target : null;
    const element = wheelTarget({ start: target, deltaY: event.deltaY });

    if (element) {
      scrollByWheel({ element, event });

      return;
    }

    event.preventDefault();
  };

  root.addEventListener('wheel', listener, { passive: false, capture: true });

  return () => root.removeEventListener('wheel', listener, { capture: true });
};
