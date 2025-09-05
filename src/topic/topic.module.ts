import { Module } from "@nestjs/common";
import { TopicService } from "./topic.service";
import { TopicController } from "./topic.controller";
import { PrismaModule } from "src/prisma/prisma.module";
@Module({
  controllers: [TopicController],
  providers: [TopicService],
  imports: [PrismaModule],
})
export class TopicModule {}
