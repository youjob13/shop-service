import { IProductQuery, ICreateProduct, IUpdateProduct, IProduct } from '@shop/dto/schemas';
import { KafkaProducer } from '@shop/kafka-client/kafka-producer';
import { URL } from 'url';

import { config as Config } from '../../config.js';
import { IProductsService } from './IProductsService.js';

export class ProductsService implements IProductsService {
  private readonly TOPIC = 'products';
  private readonly PRODUCTS_SERVICE_URL = Config.DATA_SERVICE_URL;

  constructor(private readonly kafkaProducer: KafkaProducer) {}

  async createProduct(product: ICreateProduct): Promise<void> {
    this.kafkaProducer.send(this.TOPIC, { value: product });
  }

  async getProducts(query: IProductQuery): Promise<IProduct[]> {
    try {
      const url = new URL('/products', this.PRODUCTS_SERVICE_URL);

      Object.entries(query).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error fetching products: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      throw new Error(`Failed to get products: ${error.message}`);
    }
  }

  async getProductById(id: number): Promise<IProduct | null> {
    try {
      const url = new URL(`/products/${id}`, this.PRODUCTS_SERVICE_URL);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error fetching product: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      throw new Error(`Failed to get product with id ${id}: ${error.message}`);
    }
  }

  async updateProduct(id: number, product: IUpdateProduct): Promise<void> {
    this.kafkaProducer.send(this.TOPIC, { value: { id, ...product } });
  }

  async deleteProduct(id: number): Promise<void> {
    this.kafkaProducer.send(this.TOPIC, { value: { id } });
  }
}
