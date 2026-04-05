import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async process(order: any) {
    console.log(order);
  }
}
