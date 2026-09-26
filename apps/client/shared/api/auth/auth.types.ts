export type TelegramWidgetConfig = {
  botUsername: string | null;
  enabled: boolean;
};

export type TelegramWebAppSession = {
  token: string;
  user: { id: string; name: string };
};
