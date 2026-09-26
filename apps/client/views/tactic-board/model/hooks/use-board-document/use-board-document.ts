'use client';

import { HocuspocusProvider } from '@hocuspocus/provider';
import { useEffect, useRef, useState } from 'react';
import * as Y from 'yjs';

import type { TacticLayer } from '@/entities/tactic/board';

import { env } from '@/shared/config';

import type { BoardPoint } from '../../../lib/board-geometry';
import type { BoardPeer } from '../../../lib/board-peers';
import type { BoardConnection, UpdateLayerInput } from '../../board.types';
import type { BoardHistory, BoardSession, UseBoardDocumentInput } from './use-board-document.types';

import { BOARD, BOARD_SOCKET } from '../../../config';
import { boardLayersOf, createBoardUndo, deleteLayer, readLayers, writeLayer } from '../../../lib/board-document';
import { boardPeers } from '../../../lib/board-peers';
import { boardDocumentName, boardSocketToken, boardSocketUrl } from '../../../lib/board-socket';

export const useBoardDocument = ({ board, urlToken, userName }: UseBoardDocumentInput) => {
  const sessionRef = useRef<BoardSession | null>(null);
  const cursorAtRef = useRef(0);
  const [layers, setLayers] = useState<TacticLayer[]>(board.data.layers);
  const [status, setStatus] = useState<BoardConnection>('connecting');
  const [isSynced, setIsSynced] = useState(false);
  const [isWritable, setIsWritable] = useState(false);
  const [history, setHistory] = useState<BoardHistory>({ canUndo: false, canRedo: false });
  const [peers, setPeers] = useState<BoardPeer[]>([]);
  const token = boardSocketToken({ editToken: board.editToken, urlToken, shareToken: board.shareToken });

  useEffect(() => {
    const doc = new Y.Doc();
    const array = boardLayersOf(doc);
    const undo = createBoardUndo(doc);
    const onLayers = () => setLayers(readLayers(array));
    const provider = new HocuspocusProvider({
      url: boardSocketUrl({ apiUrl: env.NEXT_PUBLIC_API_URL, path: BOARD_SOCKET.path }),
      name: boardDocumentName(board.id),
      document: doc,
      token,
      onStatus: ({ status: next }) => setStatus((current) => (current === 'denied' ? current : next)),
      onAuthenticated: ({ scope }) => setIsWritable(scope === 'read-write'),
      onAuthenticationFailed: () => setStatus('denied'),
      onSynced: ({ state }) => {
        setIsSynced(state);
        onLayers();
      }
    });

    const onHistory = () => setHistory({ canUndo: undo.canUndo(), canRedo: undo.canRedo() });
    const onAwareness = () => {
      const states = provider.awareness?.getStates();

      setPeers(states ? boardPeers({ states, selfId: doc.clientID }) : []);
    };

    array.observe(onLayers);
    undo.on('stack-item-added', onHistory);
    undo.on('stack-item-popped', onHistory);
    undo.on('stack-cleared', onHistory);
    provider.awareness?.on('change', onAwareness);
    sessionRef.current = { doc, provider, undo };

    return () => {
      sessionRef.current = null;
      array.unobserve(onLayers);
      provider.awareness?.off('change', onAwareness);
      undo.destroy();
      provider.destroy();
      doc.destroy();
      setStatus('connecting');
      setIsSynced(false);
      setIsWritable(false);
      setPeers([]);
    };
  }, [board.id, token]);

  useEffect(() => {
    sessionRef.current?.provider.setAwarenessField('name', userName);
  }, [userName, isSynced]);

  const updateLayer = ({ layerId, recipe }: UpdateLayerInput) => {
    const session = sessionRef.current;
    const layer = session ? readLayers(boardLayersOf(session.doc)).find(({ id }) => id === layerId) : undefined;

    if (session && layer) {
      writeLayer({ doc: session.doc, layer: recipe(layer) });
    }
  };

  const addLayer = (layer: TacticLayer) => {
    const session = sessionRef.current;

    if (session) {
      writeLayer({ doc: session.doc, layer });
    }
  };

  const removeLayer = (layerId: string) => {
    const session = sessionRef.current;

    if (session) {
      deleteLayer({ doc: session.doc, layerId });
    }
  };

  const undo = () => sessionRef.current?.undo.undo();

  const redo = () => sessionRef.current?.undo.redo();

  const setCursor = (point: BoardPoint | null) => {
    const now = Date.now();

    if (point !== null && now - cursorAtRef.current < BOARD.cursorThrottleMs) {
      return;
    }

    cursorAtRef.current = now;
    sessionRef.current?.provider.setAwarenessField('cursor', point);
  };

  return {
    layers,
    status,
    isSynced,
    isWritable,
    canUndo: history.canUndo,
    canRedo: history.canRedo,
    peers,
    updateLayer,
    addLayer,
    removeLayer,
    undo,
    redo,
    setCursor
  };
};
