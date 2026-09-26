export type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};
