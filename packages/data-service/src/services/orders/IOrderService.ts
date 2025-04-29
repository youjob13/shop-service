import { ICreateOrder, IOrder, IOrderQuery, IOrderStatus, IUpdateOrder } from '@shop/dto/schemas';

export interface IOrderService {
  createOrder(order: ICreateOrder): Promise<IOrder>;
  getOrders(queryParams: IOrderQuery): Promise<IOrder[]>;
  getOrderById(id: number): Promise<IOrder | null>;
  updateOrderStatus(id: number, status: IOrderStatus): Promise<IOrder>;
  cancelOrder(id: number): Promise<IOrder>;
}
