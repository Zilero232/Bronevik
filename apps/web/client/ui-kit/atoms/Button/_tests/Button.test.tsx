import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '../Button';

describe('Button', () => {
  it('defaults to type="button" so it cannot submit a surrounding form', async () => {
    const onSubmit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());

    render(
      <form onSubmit={onSubmit}>
        <Button>В бой</Button>
      </form>
    );

    await userEvent.click(screen.getByRole('button', { name: 'В бой' }));

    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('does not fire onClick when disabled', async () => {
    const onClick = vi.fn();

    render(
      <Button disabled onClick={onClick}>
        Go
      </Button>
    );

    await userEvent.click(screen.getByRole('button'));

    expect(onClick).not.toHaveBeenCalled();
  });
});
