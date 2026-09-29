export type ServerFiguresInput = {
  isPending: boolean;
  isError: boolean;
  trackedPlayers: number | null;
  online: number | null;
};

export type ServerFiguresState = 'empty' | 'error' | 'pending' | 'ready';
