import type { WebLoginPhase } from '../../../lib/web-login';

export type LoginActionsProps = {
  phase: WebLoginPhase;
  replacesSession: boolean;
  onConfirm: () => void;
};
