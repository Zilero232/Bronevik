import type { ClanEmblemSize } from '../../config';

export type ClanEmblemProps = {
  tag: string;
  src: string | null;
  size?: ClanEmblemSize;
  color?: string | null;
  className?: string;
};
