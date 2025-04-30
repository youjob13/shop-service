import { TOPICS } from '@shop/core/kafka';

import { BaseHandler } from './BaseHandler.js';
import { initKafkaConsumer } from '@shop/kafka-client/kafka-consumer';
import { ICreateProduct, IUpdateProduct } from '@shop/dto/schemas';

import { IProductService } from '../services/products/IProductService.js';

export class ProductsHandler extends BaseHandler {
  constructor(
    kafkaConsumer: ReturnType<typeof initKafkaConsumer>,
    private readonly productService: IProductService
  ) {
    super(kafkaConsumer);
  }

  protected async init(): Promise<void> {
    const kafkaConsumer = await this.kafkaConsumer;

    this.subscribeToCreateProductEvent(TOPICS.PRODUCTS, kafkaConsumer);
    this.subscribeToUpdateProductEvent(TOPICS.PRODUCTS, kafkaConsumer);
    this.subscribeToDeleteProductEvent(TOPICS.PRODUCTS, kafkaConsumer);
  }

  private subscribeToCreateProductEvent(
    topic: string,
    kafkaConsumer: Awaited<ReturnType<typeof initKafkaConsumer>>
  ): void {
    kafkaConsumer.subscribe<ICreateProduct>(topic, async (message) => {
      await this.productService.createProduct(message.value);
    });
  }

  private subscribeToUpdateProductEvent(
    topic: string,
    kafkaConsumer: Awaited<ReturnType<typeof initKafkaConsumer>>
  ): void {
    kafkaConsumer.subscribe<IUpdateProduct & { id: number }>(topic, async (message) => {
      await this.productService.updateProduct(message.value.id, message.value);
    });
  }

  private subscribeToDeleteProductEvent(
    topic: string,
    kafkaConsumer: Awaited<ReturnType<typeof initKafkaConsumer>>
  ): void {
    kafkaConsumer.subscribe<{ id: number }>(topic, async (message) => {
      await this.productService.deleteProduct(message.value.id);
    });
  }
}
