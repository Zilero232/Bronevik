export type ClanMissingProps = {
  tag: string;
  reason: 'error' | 'notFound';
  onRetry?: () => void;
};
