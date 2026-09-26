export type AuthUser = {
  id: string;
  name: string;
  email?: string | null;
  image?: string | null;
};

export type AuthSession = { user: AuthUser } | null;

export type TelegramWidgetConfig = {
  botUsername: string | null;
  enabled: boolean;
};

export type TelegramWebAppSession = {
  token: string;
  user: { id: string; name: string };
};

export type LestaStartInput = {
  callbackURL: string;
};

export type MagicLinkInput = {
  email: string;
  callbackURL: string;
};
