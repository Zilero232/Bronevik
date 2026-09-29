type ObtainLink = {
  key: string;
  title: string;
  href: string | undefined;
  date: string;
};

export type ObtainLinksProps = {
  title: string;
  items: ObtainLink[];
};
