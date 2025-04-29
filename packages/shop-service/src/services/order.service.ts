import { ICreateOrder } from '@shop/dto/schemas';
import { RpcService } from './rpc.service.js';

export class OrderService {
  private readonly TOPIC = 'orders';

  constructor(private readonly rpcService: RpcService) {}

  async createOrder(order: ICreateOrder) {
    return this.rpcService.processMessage(this.TOPIC, { value: order });
  }
}
