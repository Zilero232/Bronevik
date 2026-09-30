// @vitest-environment jsdom
import { act } from 'preact/test-utils';
import { describe, expect, it } from 'vitest';

import { stepBack } from '../../../lib/escape-stack';
import { mount } from '../../../lib/testing/mount';
import { Confirm } from '../Confirm';

describe(Confirm, () => {
  it('cancels on Esc', () => {
    const answers: string[] = [];

    mount({
      Component: Confirm,
      props: { text: 'Reset?', confirmLabel: 'Yes', cancelLabel: 'No', onConfirm: () => answers.push('yes'), onCancel: () => answers.push('no') }
    });

    act(() => {
      stepBack();
    });

    expect(answers).toEqual(['no']);
  });
});
