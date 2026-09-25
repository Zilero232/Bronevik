import { clsx } from 'clsx';

import type { PathLabelProps } from './PathLabel.types';

import { pathSegments } from '../../../../../lib/openapi-endpoints';

import s from './PathLabel.module.scss';

export const PathLabel = ({ path, className }: PathLabelProps) => (
  <code className={clsx(s.root, className)}>
    {pathSegments(path).map(({ text, isParam }, index) => (
      // eslint-disable-next-line react/no-array-index-key -- a path can repeat a segment, its position is the identity
      <span key={index} className={isParam ? s.param : undefined}>
        {text}
      </span>
    ))}
  </code>
);
