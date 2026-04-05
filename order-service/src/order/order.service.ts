import { Injectable } from '@nestjs/common';

import { CreateOrderDto } from './dto/createOrderDto';
import { RabbitMQProvider } from './providers/rabbitMQProvider';

@Injectable()
export class OrderService {
  constructor(private readonly client: RabbitMQProvider) {}

  save(order: CreateOrderDto) {
    this.client.publish('orders.exchange', 'orders.created', order);
    return order;
  }
}
