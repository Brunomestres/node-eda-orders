import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { Ctx, EventPattern, RmqContext } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/createOrderDto';
import { Channel, Message } from 'amqplib';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('orders.created')
  payment(order: CreateOrderDto, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef() as Channel;
    const originalMessage = context.getMessage() as Message;
    try {
      this.appService.process(order);

      channel.ack(originalMessage);
    } catch (err) {
      console.log(err);

      channel.nack(originalMessage, false, false);
    }
  }
}
