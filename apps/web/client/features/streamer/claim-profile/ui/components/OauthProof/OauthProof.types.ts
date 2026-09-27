export type OauthProofProps = {
  login: string | null;
  isPending: boolean;
  onClaim: () => void;
};
