import { Prisma } from '../../../../../generated';

export const blogTagsSql = (take: number): Prisma.Sql => Prisma.sql`
  SELECT tag, count(*)::int AS count
  FROM blog_post, unnest(blog_post.tags) AS tag
  WHERE blog_post.status = 'published'
  GROUP BY tag
  ORDER BY count DESC, tag
  LIMIT ${take}
`;
