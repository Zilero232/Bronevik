export type RankedRow = {
  accountId: bigint | null;
  clanId: bigint | null;
  name: string;
  clanTag: string | null;
  color: string | null;
  value: number | null;
  battles: number;
  delta: number | null;
  total: bigint;
};
