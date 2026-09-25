import { Injectable } from '@nestjs/common';
import { randomBytes } from 'node:crypto';

import type {
  BoardAccess,
  BoardState,
  CloseOwnInput,
  CreateTacticBoardRequest,
  OpenBoardInput,
  StoreBoardInput,
  TacticBoardView,
  UpdateTacticBoardRequest
} from '../community.types';

import { AppConflictException, AppForbiddenException, AppNotFoundException } from '../../../common/exceptions';
import { toJsonValue } from '../../../common/lib';
import { PrismaService } from '../../../core';
import { TACTICS } from '../config';
import { boardRole, canEdit } from '../lib';
import { readBoardData } from '../lib/board-document';

@Injectable()
export class TacticBoardService {
  constructor(private readonly prisma: PrismaService) {}

  async mine(userId: string): Promise<TacticBoardView[]> {
    const boards = await this.prisma.tacticBoard.findMany({ where: { ownerUserId: userId }, orderBy: { updatedAt: 'desc' } });

    return boards.map((board) => this.view({ board, role: 'owner' }));
  }

  async create({ userId, title, arenaId, mode, visibility, data }: CreateTacticBoardRequest): Promise<TacticBoardView> {
    const count = await this.prisma.tacticBoard.count({ where: { ownerUserId: userId } });

    if (count >= TACTICS.maxBoardsPerUser) {
      throw new AppConflictException('CONFLICT', 'Too many boards, delete some first');
    }

    const board = await this.prisma.tacticBoard.create({
      data: { ownerUserId: userId, title, arenaId: arenaId ?? null, mode: mode ?? null, visibility, data: toJsonValue(data) }
    });

    return this.view({ board, role: 'owner' });
  }

  async open({ id, userId, token }: OpenBoardInput): Promise<TacticBoardView> {
    const { board, role } = await this.access({ id, userId, token });

    return this.view({ board, role });
  }

  async update({ id, userId, token, title, arenaId, mode, visibility, data }: UpdateTacticBoardRequest): Promise<TacticBoardView> {
    const { role } = await this.access({ id, userId, token });

    if (!canEdit(role)) {
      throw new AppForbiddenException('FORBIDDEN', 'This link is view-only');
    }

    const ownerChanges = role === 'owner' ? { title, arenaId, mode, visibility } : {};
    const board = await this.prisma.tacticBoard.update({
      where: { id },
      data: { ...ownerChanges, ...(data === undefined ? {} : { data: toJsonValue(data), document: null }) }
    });

    return this.view({ board, role: role ?? 'view' });
  }

  async remove({ id, userId }: CloseOwnInput): Promise<void> {
    const { count } = await this.prisma.tacticBoard.deleteMany({ where: { id, ownerUserId: userId } });

    if (count === 0) {
      throw new AppNotFoundException('NOT_FOUND', `No board ${id} of yours`);
    }
  }

  async rotateTokens({ id, userId }: CloseOwnInput): Promise<TacticBoardView> {
    const { count } = await this.prisma.tacticBoard.updateMany({
      where: { id, ownerUserId: userId },
      data: { shareToken: randomBytes(16).toString('hex'), editToken: randomBytes(16).toString('hex') }
    });

    if (count === 0) {
      throw new AppNotFoundException('NOT_FOUND', `No board ${id} of yours`);
    }

    return this.open({ id, userId, token: null });
  }

  async access({ id, userId, token }: OpenBoardInput): Promise<BoardAccess> {
    const board = await this.prisma.tacticBoard.findUnique({ where: { id } });
    const role = board ? boardRole({ board, userId, token }) : null;

    if (!board || !role) {
      throw new AppNotFoundException('NOT_FOUND', `No board ${id}`);
    }

    return { board, role };
  }

  async loadState(id: string): Promise<BoardState> {
    const board = await this.prisma.tacticBoard.findUniqueOrThrow({ where: { id }, select: { document: true, data: true } });

    return { state: board.document ? new Uint8Array(board.document) : null, data: readBoardData(board.data) };
  }

  async storeState({ id, state, snapshot }: StoreBoardInput): Promise<void> {
    await this.prisma.tacticBoard.updateMany({
      where: { id },
      data: { document: Buffer.from(state), ...(snapshot ? { data: toJsonValue(snapshot) } : {}) }
    });
  }

  private view({ board, role }: BoardAccess): TacticBoardView {
    return {
      id: board.id,
      title: board.title,
      arenaId: board.arenaId,
      mode: board.mode,
      visibility: board.visibility,
      data: readBoardData(board.data),
      role,
      shareToken: role === 'owner' ? board.shareToken : null,
      editToken: role === 'owner' || role === 'edit' ? board.editToken : null,
      updatedAt: board.updatedAt.toISOString()
    };
  }
}
