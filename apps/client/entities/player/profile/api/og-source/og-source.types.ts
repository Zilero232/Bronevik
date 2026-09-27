import type { PlayerLookupInput, PlayerSessionInput } from '../players';
import type { PlayerWrappedInput } from '../wrapped';

export type PlayerSessionOgSourceInput = Pick<PlayerLookupInput, 'idOrNick'> & Pick<PlayerSessionInput, 'sessionId'>;

export type PlayerWrappedOgSourceInput = Pick<PlayerLookupInput, 'idOrNick'> & Pick<PlayerWrappedInput, 'year'>;
