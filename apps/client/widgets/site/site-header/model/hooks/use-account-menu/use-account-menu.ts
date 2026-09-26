'use client';

import { useAuthSession, useSignOut } from '@/entities/auth/session';

export const useAccountMenu = () => {
  const { data: session, isPending } = useAuthSession();
  const signOut = useSignOut();

  return {
    user: session?.user ?? null,
    isPending,
    isSigningOut: signOut.isPending,
    onSignOut: () => signOut.mutate()
  };
};
