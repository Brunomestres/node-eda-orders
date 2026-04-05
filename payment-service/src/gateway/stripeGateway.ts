import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from 'src/dto/createOrderDto';

@Injectable()
export class StripeGateway {
  process(order: CreateOrderDto) {
    console.log(
      `Criando ordem de pagamento para a ordem ${order.customerId} no valor de R$${order.totalAmount.toPrecision(2)}`,
    );
  }
}
