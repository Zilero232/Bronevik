export type CodeProofProps = {
  code: string | null | undefined;
  isStarting: boolean;
  isVerifying: boolean;
  onStart: () => void;
  onVerify: () => void;
};
