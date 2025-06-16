import { FastifyReply, FastifyRequest } from 'fastify';
import { IOrderParams, IOrderQuery } from '@shop/dto/schemas';
import { HTTP_STATUS } from '@shop/shared/http';

import { OrderService } from '../services/orders/order.service.js';

export class OrderController {
  constructor(private orderService: OrderService) {}

  async getOrders(
    request: FastifyRequest<{ Querystring: IOrderQuery }>,
    reply: FastifyReply
  ): Promise<never> {
    const orders = await this.orderService.getOrders(request.query);
    return reply.code(HTTP_STATUS.OK).send(orders);
  }

  async getOrderById(
    request: FastifyRequest<{ Params: IOrderParams }>,
    reply: FastifyReply
  ): Promise<never> {
    const order = await this.orderService.getOrderById(request.params.id);
    return reply.code(HTTP_STATUS.OK).send(order);
  }
}
