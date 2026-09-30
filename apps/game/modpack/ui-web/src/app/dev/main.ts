import { installGamefaceMock } from '../../shared/api/gameface/mock';
import { createDevGameface, relayEscape } from './mock-bridge';

const mock = createDevGameface();

installGamefaceMock(mock);
relayEscape(mock);
