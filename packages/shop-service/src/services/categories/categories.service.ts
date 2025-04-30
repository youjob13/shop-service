import { KafkaProducer } from '@shop/kafka-client/kafka-producer';
import { ICreateCategory, IUpdateCategory, ICategory } from '@shop/dto/schemas';
import { URL } from 'url';

import { config as Config } from '../../config.js';
import { ICategoriesService } from './ICategoriesService.js';

export class CategoriesService implements ICategoriesService {
  private readonly TOPIC = 'categories';
  private readonly CATEGORIES_SERVICE_URL = Config.DATA_SERVICE_URL;

  constructor(private readonly kafkaProducer: KafkaProducer) {}

  async createCategory(category: ICreateCategory): Promise<void> {
    this.kafkaProducer.send(this.TOPIC, { value: category });
  }

  async getCategories(): Promise<ICategory[]> {
    try {
      const url = new URL('/categories', this.CATEGORIES_SERVICE_URL);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error fetching categories: ${response.status} ${response.statusText}`);
      }

      return await response.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(`Failed to get categories: ${error.message}`);
    }
  }

  async getCategoryById(id: number): Promise<ICategory | null> {
    try {
      const url = new URL(`/categories/${id}`, this.CATEGORIES_SERVICE_URL);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error fetching category: ${response.status} ${response.statusText}`);
      }

      return await response.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(`Failed to get category with id ${id}: ${error.message}`);
    }
  }

  async updateCategory(id: number, category: IUpdateCategory): Promise<void> {
    this.kafkaProducer.send(this.TOPIC, { value: { id, ...category } });
  }

  async deleteCategory(id: number): Promise<void> {
    this.kafkaProducer.send(this.TOPIC, { value: { id } });
  }
}
