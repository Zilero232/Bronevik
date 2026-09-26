import { Module } from '@nestjs/common';

import { BotCommandsModule } from '../bot-commands';
import { vkBotProvider } from './providers';
import { VkBotService, VkStatusService } from './services';
import { VkController } from './vk.controller';

@Module({
  imports: [BotCommandsModule],
  controllers: [VkController],
  providers: [vkBotProvider, VkBotService, VkStatusService]
})
export class VkModule {}
