import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Switch } from '@/ui-kit';

describe('Switch', () => {
  it('is reachable by its label and reports the new state', async () => {
    const onCheckedChange = vi.fn();

    render(<Switch checked={false} label='Лог урона' onCheckedChange={onCheckedChange} />);
    await userEvent.click(screen.getByRole('switch', { name: 'Лог урона' }));

    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it('cannot be toggled while a change is pending', async () => {
    const onCheckedChange = vi.fn();

    render(<Switch checked isPending label='Ядро' onCheckedChange={onCheckedChange} />);
    await userEvent.click(screen.getByRole('switch', { name: 'Ядро' }));

    expect(screen.getByRole('switch', { name: 'Ядро' })).toHaveAttribute('aria-disabled', 'true');
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
