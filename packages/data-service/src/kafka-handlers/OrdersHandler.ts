import { TOPICS } from '@shop/core/kafka';

import { BaseHandler } from './BaseHandler.js';
import { initKafkaConsumer } from '@shop/kafka-client/kafka-consumer';
import { ICreateOrder, IUpdateOrder } from '@shop/dto/schemas';

import { IOrderService } from '../services/orders/IOrderService.js';

export class OrdersHandler extends BaseHandler {
  constructor(
    kafkaConsumer: ReturnType<typeof initKafkaConsumer>,
    private readonly orderService: IOrderService
  ) {
    super(kafkaConsumer);
  }

  protected async init(): Promise<void> {
    const kafkaConsumer = await this.kafkaConsumer;

    this.subscribeToCreateOrderEvent(TOPICS.ORDERS, kafkaConsumer);
    this.subscribeToUpdateOrderEvent(TOPICS.ORDERS, kafkaConsumer);
    this.subscribeToCancelOrderEvent(TOPICS.ORDERS, kafkaConsumer);
  }

  private subscribeToCreateOrderEvent(
    topic: string,
    kafkaConsumer: Awaited<ReturnType<typeof initKafkaConsumer>>
  ): void {
    kafkaConsumer.subscribe<ICreateOrder>(topic, async (message) => {
      await this.orderService.createOrder(message.value);
    });
  }

  private subscribeToUpdateOrderEvent(
    topic: string,
    kafkaConsumer: Awaited<ReturnType<typeof initKafkaConsumer>>
  ): void {
    kafkaConsumer.subscribe<IUpdateOrder & { id: number }>(topic, async (message) => {
      await this.orderService.updateOrderStatus(message.value.id, message.value.status);
    });
  }

  private subscribeToCancelOrderEvent(
    topic: string,
    kafkaConsumer: Awaited<ReturnType<typeof initKafkaConsumer>>
  ): void {
    kafkaConsumer.subscribe<{ id: number }>(topic, async (message) => {
      await this.orderService.cancelOrder(message.value.id);
    });
  }
}
