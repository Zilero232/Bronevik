export const WEBHOOK_SIGNATURE = {
  scheme: 'sha256=',
  signatureHeader: 'x-bronevik-signature',
  timestampHeader: 'x-bronevik-timestamp',
  eventHeader: 'x-bronevik-event',
  deliveryHeader: 'x-bronevik-delivery',
  toleranceSec: 300
} as const;
