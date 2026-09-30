// @vitest-environment jsdom
import { act } from 'react';
import { describe, expect, it } from 'vitest';

import { stepBack } from '../../../lib/escape-stack';
import { mount } from '../../../lib/testing/mount';
import { Confirm } from '../Confirm';

const confirmProps = (answers: string[]) => ({
  text: 'Reset?',
  confirmLabel: 'Yes',
  cancelLabel: 'No',
  onConfirm: () => answers.push('yes'),
  onCancel: () => answers.push('no')
});

describe(Confirm, () => {
  it('cancels on Esc', () => {
    const answers: string[] = [];

    mount({ Component: Confirm, props: confirmProps(answers) });

    act(() => {
      stepBack();
    });

    expect(answers).toEqual(['no']);
  });
});
