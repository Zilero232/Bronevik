import { createZodDto } from 'nestjs-zod';

import { boardTokenQuerySchema, createTacticBoardSchema, tacticBoardListSchema, tacticBoardSchema, updateTacticBoardSchema } from './tactics.schemas';

export class TacticBoardDto extends createZodDto(tacticBoardSchema) {}
export class TacticBoardListDto extends createZodDto(tacticBoardListSchema) {}
export class CreateTacticBoardDto extends createZodDto(createTacticBoardSchema) {}
export class UpdateTacticBoardDto extends createZodDto(updateTacticBoardSchema) {}
export class BoardTokenQueryDto extends createZodDto(boardTokenQuerySchema) {}
