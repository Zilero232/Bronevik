import type { QuietHours } from '../../../lib/quiet-hours';

export type QuietHoursFormProps = {
  range: QuietHours;
  onSave: (range: QuietHours) => void;
};
