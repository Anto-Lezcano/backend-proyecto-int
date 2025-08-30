import { Injectable } from "@nestjs/common";
import { ChatDto } from "./dto/chat-dto";
@Injectable()
export class ModeloChatService {
  async chatear(dto: ChatDto) {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-oss:20b",
        prompt: dto.message,
        options: {
          temperature: 0.7,
        },
      }),
    });

    const data = await response.json();
    return { reply: data.response };
  }
}
