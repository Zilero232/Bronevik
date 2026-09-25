export type DeltaValueProps = {
  value: number;
  verdict: 'better' | 'same' | 'worse';
  format?: Intl.NumberFormatOptions;
  suffix?: string;
  className?: string;
};
