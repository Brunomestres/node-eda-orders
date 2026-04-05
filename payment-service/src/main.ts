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
        queue: 'payment.order',
        exchange: 'orders.exchange',
        exchangeType: 'topic',
        routingKey: 'orders.created',
        queueOptions: {
          durable: true,
          deadLetterExchange: 'payments.dlx',
          deadLetterRoutingKey: 'payments.failed',
        },
        noAck: false,
      },
    },
  );
  await app.listen();
}
bootstrap();
