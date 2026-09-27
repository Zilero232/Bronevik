import { installGamefaceMock } from '../../shared/api/gameface/mock';
import { createDevGameface } from './mock-bridge';

installGamefaceMock(createDevGameface());
