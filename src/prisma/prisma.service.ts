// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "../../generated/prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ["query", "info", "warn", "error"],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log("Database connected");
    } catch (error) {
      console.log("Error al conectar a la base de datos:", error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
