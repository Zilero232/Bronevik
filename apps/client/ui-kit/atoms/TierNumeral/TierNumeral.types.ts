export type TierNumeralVariant = 'hex' | 'plain';

export type TierNumeralProps = {
  tier: number;
  variant?: TierNumeralVariant;
  className?: string;
};
