import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { IconButton } from '../IconButton';

describe('IconButton', () => {
  it('is named by its required aria-label and cannot submit a form', () => {
    render(<IconButton aria-label='Поиск'>*</IconButton>);

    expect(screen.getByRole('button', { name: 'Поиск' })).toHaveAttribute('type', 'button');
  });

  it('marks the active state for styling', () => {
    render(
      <IconButton isActive aria-label='В избранное'>
        *
      </IconButton>
    );

    expect(screen.getByRole('button')).toHaveAttribute('data-active', 'true');
  });

  it('forwards clicks', () => {
    const onClick = vi.fn();

    render(
      <IconButton aria-label='Меню' onClick={onClick}>
        *
      </IconButton>
    );

    fireEvent.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
