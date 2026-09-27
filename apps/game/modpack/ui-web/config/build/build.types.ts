export type BundleSpec = {
  entry: string;
  script: string;
  style: { source: string; output: string };
  page: { source: string; output: string };
};

export type StyleOptions = {
  loader: 'css';
  minify: boolean;
  target: string;
  legalComments: 'none';
  charset: 'utf8';
};
