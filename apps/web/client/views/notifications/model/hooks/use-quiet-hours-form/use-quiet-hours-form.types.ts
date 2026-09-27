import type { QuietHours } from '../../../lib/quiet-hours';

export type UseQuietHoursFormInput = {
  range: QuietHours;
  onSave: (range: QuietHours) => void;
};
