import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://bruno:root@localhost:5672'],
        queue: 'payments.failed',
        queueOptions: {
          durable: true,
          exclusive: false,
          autoDelete: false,
        },
        noAck: false,
      },
    },
  );
  await app.listen();
}
bootstrap();
