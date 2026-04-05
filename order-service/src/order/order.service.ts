import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/createOrderDto';

@Injectable()
export class OrderService {
  constructor(
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
  ) {}

  save(order: CreateOrderDto) {
    this.client.emit('order.created', order).subscribe((response) => {
      console.log(response);
    });
  }
}
