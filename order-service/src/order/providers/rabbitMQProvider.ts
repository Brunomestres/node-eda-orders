/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Channel, ChannelModel, connect } from 'amqplib';

@Injectable()
export class RabbitMQProvider implements OnModuleInit {
  private connection: ChannelModel;
  private channel: Channel;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const connectionURL = this.configService.getOrThrow<string>('RABBITMQ_URL');
    this.connection = await connect(connectionURL);
    this.channel = await this.connection.createChannel();

    await this.channel.assertExchange('orders.exchange', 'topic', {
      durable: true,
    });
  }

  publish(exchange: string, routingKey: string, data: any) {
    const newMessage = {
      pattern: routingKey,
      data,
    };

    this.channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(newMessage)),
    );
  }
}
