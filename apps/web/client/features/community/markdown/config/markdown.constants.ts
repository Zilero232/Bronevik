import remarkGfm from 'remark-gfm';

export const MARKDOWN = {
  remarkPlugins: [remarkGfm],
  externalRel: 'noopener noreferrer nofollow',
  externalTarget: '_blank'
} as const;
