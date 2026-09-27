export type AuthUser = {
  id: string;
  name: string;
  email?: string | null;
  image?: string | null;
};

export type AuthSession = { user: AuthUser; lestaAccountId: number | null } | null;

export type DeleteAccountOutcome = 'deleted' | 'reauthenticate';
