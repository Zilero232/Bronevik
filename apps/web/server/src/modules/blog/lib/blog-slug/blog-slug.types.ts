export type BlogSlugInput = {
  title: string;
  slug?: string;
};

export type UniqueBlogSlugInput = {
  base: string;
  suffix: string;
};
