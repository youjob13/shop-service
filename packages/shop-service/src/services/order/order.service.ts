import { ICreateOrder, IOrderQuery, IOrder } from '@shop/dto/schemas';
import { KafkaProducer } from '@shop/kafka-client/kafka-producer';
import { URL } from 'url';

import { config as Config } from '../../config.js';
import { IOrderService } from './IOrderService.js';

export class OrderService implements IOrderService {
  private readonly TOPIC = 'orders';
  private readonly ORDER_SERVICE_URL = Config.DATA_SERVICE_URL;

  constructor(private readonly kafkaProducer: KafkaProducer) {}

  async createOrder(order: ICreateOrder): Promise<void> {
    this.kafkaProducer.send(this.TOPIC, { value: order });
  }

  async getOrders(query: IOrderQuery): Promise<IOrder[]> {
    try {
      const url = new URL('/orders', this.ORDER_SERVICE_URL);

      Object.entries(query).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error fetching orders: ${response.status} ${response.statusText}`);
      }

      return await response.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(`Failed to get orders: ${error.message}`);
    }
  }

  async getOrderById(id: number): Promise<IOrder | null> {
    try {
      const url = new URL(`/orders/${id}`, this.ORDER_SERVICE_URL);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error fetching order: ${response.status} ${response.statusText}`);
      }

      return await response.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(`Failed to get order with id ${id}: ${error.message}`);
    }
  }

  async updateOrderStatus(id: number, status: string): Promise<void> {
    this.kafkaProducer.send(this.TOPIC, { value: { id, status } });
  }

  async cancelOrder(id: number): Promise<void> {
    this.kafkaProducer.send(this.TOPIC, { value: { id } });
  }
}
