import { VK_LAUNCH } from '../../config';

export const readVkLaunchParams = (search: string): string | null => {
  const params = new URLSearchParams(search);

  return VK_LAUNCH.requiredParams.every((name) => params.get(name)) ? search.replace(/^\?/u, '') : null;
};
