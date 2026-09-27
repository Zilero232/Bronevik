export type CrossOriginInput = {
  method: string;
  origin: string | undefined;
  fetchSite: string | undefined;
  cookie: string | undefined;
  allowed: readonly string[];
};
