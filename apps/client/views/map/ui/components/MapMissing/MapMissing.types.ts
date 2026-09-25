export type MapMissingProps = {
  id: string;
  reason: 'error' | 'notFound';
  onRetry?: () => void;
};
