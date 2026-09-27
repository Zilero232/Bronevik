import { handleExternalLink } from '@/shared/lib';

import type { ExternalLinkProps } from './ExternalLink.types';

import s from './ExternalLink.module.scss';

export const ExternalLink = ({ href, children }: ExternalLinkProps) => (
  <a className={s.root} href={href} rel='noreferrer' target='_blank' onClick={handleExternalLink(href)}>
    {children}
  </a>
);
