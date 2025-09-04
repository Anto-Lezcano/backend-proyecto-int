import { Injectable } from "@nestjs/common";
import { ChatDto } from "./dto/chat-dto";
@Injectable()
export class ModeloChatService {
  async chatear(dto: ChatDto) {
    const response = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: dto.question,
        student_id: dto.student_id,
        unit: dto.unit,
      }),
    });

    const data = await response.json();
    return { reply: data.answer };
  }
}
