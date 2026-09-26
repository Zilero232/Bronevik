import type { PageHeroProps } from './PageHero.types';

import { PageHeader } from '../PageHeader';

export const PageHero = ({ title, description, aside, children, className }: PageHeroProps) => (
  <PageHeader actions={children} aside={aside} className={className} description={description} title={title} />
);
