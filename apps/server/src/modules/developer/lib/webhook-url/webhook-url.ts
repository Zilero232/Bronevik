import { WEBHOOK_URL } from './webhook-url.constants';

export const isPublicWebhookUrl = (value: string): boolean => {
  if (!URL.canParse(value)) {
    return false;
  }

  const { protocol, hostname } = new URL(value);
  const host = hostname.replace(/^\[|\]$/g, '');

  if (protocol !== 'https:') {
    return false;
  }

  return ![...WEBHOOK_URL.blockedHosts, ...WEBHOOK_URL.blockedIpv4, ...WEBHOOK_URL.blockedIpv6].some((pattern) => pattern.test(host));
};
