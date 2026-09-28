import { useExternalLink } from '@/shared/lib';

import type { ExternalLinkProps } from './ExternalLink.types';

import s from './ExternalLink.module.scss';

export const ExternalLink = ({ href, children }: ExternalLinkProps) => {
  const onClick = useExternalLink(href);

  return (
    <a className={s.root} href={href} rel='noreferrer' target='_blank' onClick={onClick}>
      {children}
    </a>
  );
};
