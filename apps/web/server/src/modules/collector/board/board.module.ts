import { Module } from '@nestjs/common';

import { BoardService } from './services';

@Module({
  providers: [BoardService]
})
export class BoardModule {}
