import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  // Comma-separated list so prod + localhost (and preview URLs) can coexist.
  const origins = (process.env.WEB_ORIGIN ?? 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  app.enableCors({
    origin: origins,
    credentials: true,
  });

  // OpenAPI / Swagger docs at /docs
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Tarot AI API')
    .setDescription(
      'Cards reference deck and reading draws for the Tarot AI app.',
    )
    .setVersion('0.1.0')
    .addTag('cards', 'The immutable 78-card reference deck')
    .addTag('readings', 'Draw cards for a spread')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'Tarot AI API Docs',
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);

  console.log(`API running on http://localhost:${port}/api — docs at /docs`);
}
void bootstrap();
