import { Module } from '@nestjs/common';

import { CommunityBuildsController } from './community-builds.controller';
import { BuildShareService } from './services';

@Module({
  controllers: [CommunityBuildsController],
  providers: [BuildShareService]
})
export class CommunityBuildsModule {}
