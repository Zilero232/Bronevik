import type { ReactNode } from 'react';

import type { SocialSection } from '../../model/social-shell.types';

export type SocialShellProps = {
  section: SocialSection;
  figures?: ReactNode;
  children: ReactNode;
};
