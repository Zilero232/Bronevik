export type ServiceStatusValue = 'degraded' | 'down' | 'ok' | 'unknown';

export type ServiceStatusProps = {
  status: ServiceStatusValue;
  isLabelVisible?: boolean;
  className?: string;
};
