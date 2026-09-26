import remarkGfm from 'remark-gfm';

export const MARKDOWN = {
  remarkPlugins: [remarkGfm],
  externalRel: 'noopener noreferrer nofollow',
  externalTarget: '_blank',
  externalProtocols: ['http:', 'https:', 'mailto:']
} as const;
