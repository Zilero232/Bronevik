export type SwitchProps = {
  checked: boolean;
  label: string;
  description?: string;
  disabled?: boolean;
  isLocked?: boolean;
  isPending?: boolean;
  hideLabel?: boolean;
  onCheckedChange: (checked: boolean) => void;
};
