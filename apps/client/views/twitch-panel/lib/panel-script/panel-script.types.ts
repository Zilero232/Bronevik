import type { TWITCH_PANEL } from '../../config';
import type { PanelHtmlInput } from '../panel-html';

export type PanelConfig = PanelHtmlInput & Pick<typeof TWITCH_PANEL, 'refreshMs'>;

export type TwitchExtension = {
  onContext: (listener: (context: { theme?: string }) => void) => void;
  onAuthorized: (listener: (auth: { channelId: string }) => void) => void;
};

export type PanelWindow = Window & { Twitch?: { ext?: TwitchExtension } };
