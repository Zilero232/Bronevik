import type { EconomyAccount } from '@otmetki/schemas';

export type UseEconomyColumnsInput = {
  account: EconomyAccount;
  withReserve: boolean;
  withClanPayout: boolean;
};
