import { PUSH_SERVICE } from '../notifications.constants';

const hosts = new Set<string>(PUSH_SERVICE.hosts);

export const isPushServiceUrl = (value: string): boolean => {
  if (!URL.canParse(value)) {
    return false;
  }

  const url = new URL(value);
  const host = url.hostname.toLowerCase();

  if (url.protocol !== 'https:' || url.username !== '' || url.password !== '' || (url.port !== '' && url.port !== '443')) {
    return false;
  }

  return hosts.has(host) || PUSH_SERVICE.hostSuffixes.some((suffix) => host.endsWith(suffix));
};
