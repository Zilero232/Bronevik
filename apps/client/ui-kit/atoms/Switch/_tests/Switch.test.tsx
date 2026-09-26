import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Switch } from '../Switch';

describe('Switch', () => {
  it('is named by its label', () => {
    render(<Switch checked={false} label='Узоры' onCheckedChange={vi.fn()} />);

    expect(screen.getByRole('switch', { name: 'Узоры' })).not.toBeChecked();
  });

  it('reports the flipped state', async () => {
    const onCheckedChange = vi.fn();

    render(<Switch checked label='Узоры' onCheckedChange={onCheckedChange} />);

    await userEvent.click(screen.getByRole('switch'));

    expect(onCheckedChange).toHaveBeenCalledWith(false, expect.anything());
  });

  it('flips from the keyboard', async () => {
    const onCheckedChange = vi.fn();

    render(<Switch checked={false} label='Узоры' onCheckedChange={onCheckedChange} />);

    screen.getByRole('switch').focus();
    await userEvent.keyboard(' ');

    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
  });
});
