import type { IsPublishedInput } from './release-source.types';

export const isPublished = ({ index, version }: IsPublishedInput): boolean => index.releases.some((release) => release.version === version);
