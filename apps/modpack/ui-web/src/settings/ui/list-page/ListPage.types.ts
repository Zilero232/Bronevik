import type { RunActionInput } from '../../model/hooks/use-actions';
import type { UiPage } from '../../model/protocol';

export type ListPageProps = {
  page: UiPage;
  onRun: (input: RunActionInput) => void;
};
