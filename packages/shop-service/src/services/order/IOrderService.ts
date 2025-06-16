import { ICreateOrder, IOrder, IOrderQuery } from '@shop/dto/schemas';

export interface IOrderService {
  createOrder(order: ICreateOrder): Promise<void>;
  updateOrderStatus(id: number, status: string): Promise<void>;
  getOrders(query: IOrderQuery): Promise<IOrder[]>;
  getOrderById(id: number): Promise<IOrder | null>;
  cancelOrder(id: number): Promise<void>;
}
