import type { ProgressState, ProgressToggleInput } from './progress-toggle.types';

export const progressToggle = ({ current, field, checked }: ProgressToggleInput): ProgressState => {
  if (field === 'honors') {
    return { done: checked || current.done, honors: checked };
  }

  return { done: checked, honors: checked && current.honors };
};
