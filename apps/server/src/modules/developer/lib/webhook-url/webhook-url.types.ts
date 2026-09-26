import type { LookupAddress } from 'node:dns';

export type HostLookup = (host: string) => Promise<LookupAddress[]>;

export type ResolvesPubliclyInput = {
  url: string;
  lookup?: HostLookup;
};
