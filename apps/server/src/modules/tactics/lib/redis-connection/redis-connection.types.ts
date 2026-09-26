export type RedisConnection = {
  host: string;
  port: number;
  options: {
    username?: string;
    password?: string;
    db?: number;
    tls?: Record<string, never>;
  };
};
