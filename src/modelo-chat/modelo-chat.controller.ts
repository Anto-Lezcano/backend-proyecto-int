import { Controller, Post, Body } from "@nestjs/common";
import { ModeloChatService } from "./modelo-chat.service";
import { ChatDto } from "./dto/chat-dto";
@Controller("modelo-chat")
export class ModeloChatController {
  constructor(private readonly modeloChatService: ModeloChatService) {}

  @Post()
  chatear(@Body() dto: ChatDto) {
    return this.modeloChatService.chatear(dto);
  }
}
