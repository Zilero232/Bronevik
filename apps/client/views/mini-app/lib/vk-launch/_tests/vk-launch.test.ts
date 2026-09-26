import { describe, expect, it } from 'vitest';

import { readVkLaunchParams } from '../vk-launch';

describe('readVkLaunchParams', () => {
  it('keeps the signed launch params of a VK Mini App launch', () => {
    expect(readVkLaunchParams('?vk_user_id=1&vk_app_id=2&vk_ts=3&sign=abc')).toBe('vk_user_id=1&vk_app_id=2&vk_ts=3&sign=abc');
  });

  it('ignores a plain browser visit or unsigned params', () => {
    expect(readVkLaunchParams('')).toBeNull();
    expect(readVkLaunchParams('?vk_user_id=1&vk_app_id=2')).toBeNull();
  });
});
