import { Module } from '@nestjs/common';
import { ModeloChatService } from './modelo-chat.service';
import { ModeloChatController } from './modelo-chat.controller';

@Module({
  controllers: [ModeloChatController],
  providers: [ModeloChatService],
})
export class ModeloChatModule {}
