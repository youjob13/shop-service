import { TOPICS } from '@shop/core/kafka';

import { BaseHandler } from './BaseHandler.js';
import { initKafkaConsumer } from '@shop/kafka-client/kafka-consumer';
import { ICreateCategory, IUpdateCategory } from '@shop/dto/schemas';

import { CategoryService } from '../services/categories/category.service.js';

export class CategoriesHandler extends BaseHandler {
  constructor(
    kafkaConsumer: ReturnType<typeof initKafkaConsumer>,
    private readonly categoryService: CategoryService
  ) {
    super(kafkaConsumer);
  }

  protected async init(): Promise<void> {
    const kafkaConsumer = await this.kafkaConsumer;

    this.subscribeToCreateCategoryEvent(TOPICS.CATEGORIES, kafkaConsumer);
    this.subscribeToUpdateCategoryEvent(TOPICS.CATEGORIES, kafkaConsumer);
    this.subscribeToDeleteCategoryEvent(TOPICS.CATEGORIES, kafkaConsumer);
  }

  private subscribeToCreateCategoryEvent(
    topic: string,
    kafkaConsumer: Awaited<ReturnType<typeof initKafkaConsumer>>
  ) {
    kafkaConsumer.subscribe<ICreateCategory>(topic, async (message) => {
      await this.categoryService.createCategory(message.value);
    });
  }

  private subscribeToUpdateCategoryEvent(
    topic: string,
    kafkaConsumer: Awaited<ReturnType<typeof initKafkaConsumer>>
  ) {
    kafkaConsumer.subscribe<IUpdateCategory & { id: number }>(topic, async (message) => {
      await this.categoryService.updateCategory(message.value.id, message.value);
    });
  }

  private subscribeToDeleteCategoryEvent(
    topic: string,
    kafkaConsumer: Awaited<ReturnType<typeof initKafkaConsumer>>
  ) {
    kafkaConsumer.subscribe<{ id: number }>(topic, async (message) => {
      await this.categoryService.deleteCategory(message.value.id);
    });
  }
}
