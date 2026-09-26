import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Avatar } from '../Avatar';

describe('Avatar', () => {
  it('falls back to the initials when there is no picture', () => {
    render(<Avatar name='Grom_i_Molniya' />);

    expect(screen.getByText('GI')).toBeInTheDocument();
  });
});
