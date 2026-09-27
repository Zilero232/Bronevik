import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Skeleton } from '../Skeleton';

describe('Skeleton', () => {
  it('renders a single placeholder by default', () => {
    const { container } = render(<Skeleton />);

    expect(container.children).toHaveLength(1);
  });

  it('renders as many placeholders as the count asks for', () => {
    const { container } = render(<Skeleton count={3} height={12} />);

    expect(container.children).toHaveLength(3);
  });
});
