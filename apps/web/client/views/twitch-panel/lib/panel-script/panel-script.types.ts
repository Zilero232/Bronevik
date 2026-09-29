import type { TWITCH_PANEL } from '../../config';
import type { PanelHtmlInput } from '../panel-html';

export type PanelConfig = PanelHtmlInput & Pick<typeof TWITCH_PANEL, 'refreshMs'>;

type TwitchExtension = {
  onContext: (listener: (context: { theme?: string }) => void) => void;
  onAuthorized: (listener: (auth: { channelId: string }) => void) => void;
};

export type PanelWindow = Window & { Twitch?: { ext?: TwitchExtension } };

export type PanelElementInput = {
  tag: string;
  className?: string;
  text?: string;
};

export type PanelStatInput = {
  label: string;
  value: string;
};
