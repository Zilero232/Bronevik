import type { OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import type { IncomingMessage } from 'node:http';
import type { Duplex } from 'node:stream';

import { Hocuspocus } from '@hocuspocus/server';
import { Injectable, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { WebSocketServer } from 'ws';

import type { CollabContext } from '../community.types';

import { allowedOrigins, AppConfigService } from '../../../config';
import { TACTICS } from '../config';
import { canEdit } from '../lib';
import { boardIdOf, boardSnapshot, encodeBoard, restoreBoard, seedBoardDocument } from '../lib/board-document';
import { TacticBoardService } from '../services/tactic-board.service';

@Injectable()
export class TacticsCollabService implements OnApplicationBootstrap, OnApplicationShutdown {
  private readonly logger = new Logger(TacticsCollabService.name);
  private readonly sockets = new WebSocketServer({ noServer: true });
  private readonly hocuspocus = new Hocuspocus<CollabContext>({
    quiet: true,
    debounce: TACTICS.debounceMs,
    maxDebounce: TACTICS.maxDebounceMs,
    onAuthenticate: async ({ documentName, token, connectionConfig }) => {
      const boardId = boardIdOf({ prefix: TACTICS.documentPrefix, name: documentName });

      if (!boardId) {
        throw new Error('Unknown board');
      }

      const { role } = await this.boards.access({ id: boardId, userId: null, token: token || null });

      connectionConfig.readOnly = !canEdit(role);

      return { boardId };
    },
    onLoadDocument: async ({ document, context }) => {
      const { state, data } = await this.boards.loadState(context.boardId);

      if (state) {
        restoreBoard({ document, state });
      } else {
        seedBoardDocument({ document, data });
      }

      return document;
    },
    onStoreDocument: async ({ document, documentName }) => {
      const boardId = boardIdOf({ prefix: TACTICS.documentPrefix, name: documentName });

      if (boardId) {
        await this.boards.storeState({ id: boardId, state: encodeBoard(document), snapshot: boardSnapshot(document) });
      }
    }
  });

  constructor(
    private readonly adapterHost: HttpAdapterHost,
    private readonly boards: TacticBoardService,
    private readonly config: AppConfigService
  ) {}

  onApplicationBootstrap(): void {
    const server = this.adapterHost.httpAdapter?.getHttpServer();

    if (!server) {
      return;
    }

    const origins = allowedOrigins({ CORS_ORIGINS: this.config.get('CORS_ORIGINS'), WEB_URL: this.config.get('WEB_URL') });

    server.on('upgrade', (request: IncomingMessage, socket: Duplex, head: Buffer) => {
      const url = new URL(request.url ?? '/', 'http://localhost');

      if (url.pathname !== TACTICS.path) {
        return;
      }

      if (request.headers.origin && !origins.includes(request.headers.origin)) {
        socket.destroy();

        return;
      }

      this.sockets.handleUpgrade(request, socket, head, (websocket) => {
        const headers = new Headers();

        for (const [key, value] of Object.entries(request.headers)) {
          if (typeof value === 'string') {
            headers.set(key, value);
          }
        }

        const connection = this.hocuspocus.handleConnection(websocket, new Request(url.href, { headers }));

        websocket.on('message', (data: Buffer) => connection.handleMessage(new Uint8Array(data)));
        websocket.on('close', () => connection.handleClose());
      });
    });

    this.logger.log(`tactics boards collaborate at ${TACTICS.path}`);
  }

  async onApplicationShutdown(): Promise<void> {
    this.hocuspocus.flushPendingStores();
    this.hocuspocus.closeConnections();
    this.sockets.close();
  }
}
