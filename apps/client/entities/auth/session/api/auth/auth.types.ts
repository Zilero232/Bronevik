export type AuthUser = {
  id: string;
  name: string;
  email?: string | null;
  image?: string | null;
};

export type AuthSession = { user: AuthUser } | null;
