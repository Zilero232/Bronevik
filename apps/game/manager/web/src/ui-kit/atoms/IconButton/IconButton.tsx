import type { IconButtonProps } from './IconButton.types';

import { Button } from '../Button';

export const IconButton = ({ label, children, ...props }: IconButtonProps) => (
  <Button aria-label={label} size='icon' title={label} variant='ghost' {...props}>
    {children}
  </Button>
);
