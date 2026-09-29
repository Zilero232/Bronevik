import type { RATINGS_METHOD_SECTIONS } from '../../config';

type RatingsMethodSection = (typeof RATINGS_METHOD_SECTIONS)[number];

export type RatingsMethodLinkProps = {
  section?: RatingsMethodSection;
  isIconOnly?: boolean;
  className?: string;
};
