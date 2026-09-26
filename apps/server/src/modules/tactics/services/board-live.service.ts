import type { Hocuspocus } from '@hocuspocus/server';

import { Injectable } from '@nestjs/common';

import type { CollabContext, ReplaceLiveDataInput } from '../tactics.types';

import { TACTICS } from '../config';
import { replaceBoardLayers } from '../lib';

@Injectable()
export class BoardLiveService {
  private hocuspocus: Hocuspocus<CollabContext> | null = null;

  attach(hocuspocus: Hocuspocus<CollabContext>): void {
    this.hocuspocus = hocuspocus;
  }

  close(id: string): void {
    this.hocuspocus?.closeConnections(`${TACTICS.documentPrefix}${id}`);
  }

  replaceData({ id, data }: ReplaceLiveDataInput): boolean {
    const document = this.hocuspocus?.documents.get(`${TACTICS.documentPrefix}${id}`);

    if (!document || document.isLoading) {
      return false;
    }

    replaceBoardLayers({ document, data });

    return true;
  }
}
