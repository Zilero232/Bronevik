export const PROFILE_LINKS = ['twitch', 'vk', 'youtube', 'telegram', 'boosty'] as const;

export type ProfileLink = (typeof PROFILE_LINKS)[number];

export const PROFILE_FORM = {
  noAccount: 'none',
  linkProtocol: /^https?$/u,
  slugTakenStatus: 409
} as const;
