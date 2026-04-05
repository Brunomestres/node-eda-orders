import { Controller } from '@nestjs/common';
import { CreateOrderDto } from './dto/createOrderDto';
import { Ctx, EventPattern, RmqContext } from '@nestjs/microservices';
import { Channel, Message } from 'amqplib';

@Controller()
export class AppController {
  @EventPattern('orders.created')
  handle(order: CreateOrderDto, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef() as Channel;
    const originalMessage = context.getMessage() as Message;
    try {
      console.log(order);

      channel.ack(originalMessage);
    } catch (err) {
      console.log(err);

      channel.nack(originalMessage, false, false);
    }
  }
}
