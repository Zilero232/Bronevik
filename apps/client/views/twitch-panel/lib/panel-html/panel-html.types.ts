import type { TWITCH_PANEL } from '../../config';

export type PanelCopy = Record<(typeof TWITCH_PANEL.copyKeys)[number], string>;

export type PanelHtmlInput = {
  apiUrl: string;
  locale: string;
  copy: PanelCopy;
};
