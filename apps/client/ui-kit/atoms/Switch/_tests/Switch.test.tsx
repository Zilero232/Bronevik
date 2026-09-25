import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Switch } from '../Switch';

describe('Switch', () => {
  it('is named by its label', () => {
    render(<Switch checked={false} label='Узоры' onCheckedChange={vi.fn()} />);

    expect(screen.getByRole('switch', { name: 'Узоры' })).not.toBeChecked();
  });

  it('reports the flipped state', () => {
    const onCheckedChange = vi.fn();

    render(<Switch checked label='Узоры' onCheckedChange={onCheckedChange} />);

    fireEvent.click(screen.getByRole('switch'));

    expect(onCheckedChange).toHaveBeenCalledWith(false, expect.anything());
  });
});
