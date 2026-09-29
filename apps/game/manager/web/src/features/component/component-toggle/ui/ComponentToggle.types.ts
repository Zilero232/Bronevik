export type ComponentToggleProps = {
  clientPath: string | null;
  componentId: string;
  title: string;
  libraries: readonly string[];
  checked: boolean;
  disabled: boolean;
  isLocked?: boolean;
};
