import type { Language } from '../../../shared/i18n';

export type FramePress = Pick<MouseEvent, 'clientX' | 'clientY' | 'preventDefault'>;

export type HeaderFrame = {
  zoom: number;
  canZoomIn: boolean;
  canZoomOut: boolean;
  zoomIn: () => void;
  zoomOut: () => void;
  onMoveStart: (event: FramePress) => void;
  onRecentre: () => void;
};

export type HeaderProps = {
  language: Language;
  compact: boolean;
  frame: HeaderFrame;
};
