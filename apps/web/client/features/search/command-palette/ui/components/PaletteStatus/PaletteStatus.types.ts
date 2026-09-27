export type PaletteStatusProps = {
  total: number;
  isEnabled: boolean;
  isFetching: boolean;
  isError: boolean;
  onRetry: () => void;
};
