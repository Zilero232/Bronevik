import { useClients } from '../use-clients';

export const useSelectedClient = () => {
  const query = useClients();
  const clients = query.data?.clients ?? [];
  const clientPath = query.data?.selected ?? null;
  const client = clients.find((candidate) => candidate.path === clientPath);

  return { query, clients, clientPath, client };
};
