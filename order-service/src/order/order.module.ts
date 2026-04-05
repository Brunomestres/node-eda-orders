import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ConfigModule } from '@nestjs/config';
import { RabbitMQProvider } from './providers/rabbitMQProvider';

@Module({
  controllers: [OrderController],
  imports: [ConfigModule],
  providers: [OrderService, RabbitMQProvider],
  exports: [],
})
export class OrderModule {}
