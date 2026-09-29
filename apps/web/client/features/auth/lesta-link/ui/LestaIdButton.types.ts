import type { LestaStartUrlInput } from '../model/hooks';
import type { LestaIdLinkProps } from './components';

export type LestaIdButtonProps = LestaStartUrlInput & Omit<LestaIdLinkProps, 'href'>;
