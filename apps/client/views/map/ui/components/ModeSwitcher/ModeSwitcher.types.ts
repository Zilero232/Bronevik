export type ModeSwitcherProps = {
  mode: string;
  available: string[];
  onChange: (mode: string) => void;
};
