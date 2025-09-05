import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from "@nestjs/common";
import { TopicService } from "./topic.service";
import { CreateTopicDto } from "./dto/create-topic.dto";
import { UpdateTopicDto } from "./dto/update-topic.dto";

@Controller("topic")
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Post("create")
  create(@Body() createTopicDto: CreateTopicDto) {
    return this.topicService.createTopic(createTopicDto);
  }

  @Get()
  findAll() {
    return this.topicService.findAllTopic();
  }

  @Get("unit/:unit")
  findOne(@Param("unit") unit: string) {
    return this.topicService.findTopicByUnit(+unit);
  }

  @Put("update/:id")
  update(@Param("id") id: string, @Body() updateTopicDto: UpdateTopicDto) {
    return this.topicService.updateTopic(+id, updateTopicDto);
  }

  @Delete("delete/:id")
  remove(@Param("id") id: string) {
    return this.topicService.removeTopic(+id);
  }
}
