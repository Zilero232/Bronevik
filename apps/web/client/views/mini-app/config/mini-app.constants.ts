export const MINI_APP = {
  marksLimit: 3,
  sessionsLimit: 1
} as const;

export const MINI_APP_PLATFORMS = ['telegram', 'vk'] as const;

export const VK_LAUNCH = {
  requiredParams: ['vk_user_id', 'vk_app_id', 'sign']
} as const;
