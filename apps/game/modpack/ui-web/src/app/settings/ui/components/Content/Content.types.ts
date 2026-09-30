import type { Section } from '../../../../../entities/window-state';
import type { UiState } from '../../../../../shared/api/protocol';

export type ContentProps = {
  state: UiState;
  section: Section;
  searching: boolean;
  columns: number;
};
