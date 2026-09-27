import type { PlayerLookupInput, PlayerSessionInput } from '../players/players.types';

export type PlayerSessionOgSourceInput = Pick<PlayerLookupInput, 'idOrNick'> & Pick<PlayerSessionInput, 'sessionId'>;
