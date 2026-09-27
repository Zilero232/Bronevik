import { Injectable } from '@nestjs/common';
import { lookup } from 'node:dns/promises';

import type { HostLookup } from '../lib';

@Injectable()
export class HostLookupService {
  readonly resolve: HostLookup = async (host) => lookup(host, { all: true });
}
