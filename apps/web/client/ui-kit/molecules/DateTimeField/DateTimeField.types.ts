export type DateTimeFieldProps = {
  value: string;
  placeholder?: string;
  stepMinutes?: number;
  isInvalid?: boolean;
  className?: string;
  'aria-label'?: string;
  onChange: (value: string) => void;
};
