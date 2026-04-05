import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/createOrderDto';
import { StripeGateway } from './gateway/stripeGateway';

const MAX_ATTEMPTS = 5;
const DELAY = 5000;
@Injectable()
export class AppService {
  constructor(private readonly stripeGateway: StripeGateway) {}
  async process(order: CreateOrderDto) {
    let lastError: Error = new Error('unknow error');
    for (let attempts = 1; attempts <= MAX_ATTEMPTS; attempts++) {
      try {
        this.stripeGateway.process(order);
        return;
      } catch (err) {
        lastError = err as Error;
        console.log(`Retrying ${attempts} in ${DELAY / 1000}`);
        await new Promise((resolve) => setTimeout(resolve, DELAY));
      }
    }

    throw lastError;
  }
}
