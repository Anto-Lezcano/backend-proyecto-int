import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieparser from "cookie-parser";
import * as morgan from "morgan";
import {
  ValidationPipe,
  BadRequestException,
  ValidationError,
} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn", "log", "debug"],
  });

  app.use(cookieparser());
  app.enableCors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:5500",
      "http://127.0.0.1:8000",
    ],
    credentials: true,
  });
  app.use(morgan("dev"));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const messages = validationErrors.flatMap((error) =>
          Object.values(error.constraints || {}).map(
            (msg) => `${error.property}: ${msg}`
          )
        );
        return new BadRequestException(messages);
      },
    })
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
