import type { BotProvider, UnlinkBotInput } from '../../../../../api';
import type { BotRowView } from '../../../../../lib/bot-rows';

export type BotRowProps = {
  row: BotRowView;
  isBusy: boolean;
  onLink: (provider: BotProvider) => void;
  onUnlink: (input: UnlinkBotInput) => void;
};
