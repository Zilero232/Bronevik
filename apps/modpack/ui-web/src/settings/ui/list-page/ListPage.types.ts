import type { RunActionInput } from '../../model/hooks/use-actions/use-actions.types';
import type { UiPage } from '../../model/protocol/protocol.types';

export type ListPageProps = {
  page: UiPage;
  onRun: (input: RunActionInput) => void;
};
