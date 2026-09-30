import type { RefObject } from 'preact';

import type { Language } from '../../../shared/i18n';

export type HeaderFrame = {
  zoom: number;
  canZoomIn: boolean;
  canZoomOut: boolean;
  zoomIn: () => void;
  zoomOut: () => void;
  handles: { move: RefObject<HTMLDivElement> };
  onRecentre: () => void;
};

export type HeaderProps = {
  language: Language;
  compact: boolean;
  frame: HeaderFrame;
};
