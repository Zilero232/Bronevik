import { BlockList, isIPv4, isIPv6 } from 'node:net';

import type { AllowListInput } from './webhook-ip.types';

export const buildAllowList = (cidrs: readonly string[]): BlockList => {
  const list = new BlockList();

  for (const cidr of cidrs) {
    const [address = '', prefix = ''] = cidr.split('/');

    list.addSubnet(address, Number(prefix), isIPv6(address) ? 'ipv6' : 'ipv4');
  }

  return list;
};

export const isAllowedIp = ({ list, ip: raw }: AllowListInput): boolean => {
  const ip = raw.replace(/^::ffff:/u, '');

  if (isIPv4(ip)) {
    return list.check(ip, 'ipv4');
  }

  return isIPv6(ip) && list.check(ip, 'ipv6');
};
