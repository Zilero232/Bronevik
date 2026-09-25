import { Module } from '@nestjs/common';

import { BoardService } from './services/board.service';

@Module({
  providers: [BoardService]
})
export class BoardModule {}
