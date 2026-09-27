export type TelegramWidgetConfig = {
  botUsername: string | null;
  enabled: boolean;
};

export type MiniAppSession = {
  token: string;
  user: { id: string; name: string };
};

export type TelegramWebAppSession = MiniAppSession;
