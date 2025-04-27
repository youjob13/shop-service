import { FastifyReply, FastifyRequest } from 'fastify';
import { OrderService } from '../services/order.service.js';
import { ICreateOrder, IOrderParams, IUpdateOrder, IOrderQuery } from '../schemas.js';
import { HTTP_STATUS } from '../constants/http.js';

export class OrderController {
  constructor(private orderService: OrderService) {}

  async createOrder(
    request: FastifyRequest<{ Body: ICreateOrder }>,
    reply: FastifyReply
  ): Promise<never> {
    const order = await this.orderService.createOrder(request.body);
    return reply.code(HTTP_STATUS.CREATED).send(order);
  }

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

  async updateOrderStatus(
    request: FastifyRequest<{
      Params: IOrderParams;
      Body: IUpdateOrder;
    }>,
    reply: FastifyReply
  ): Promise<never> {
    const order = await this.orderService.updateOrderStatus(request.params.id, request.body.status);
    return reply.code(HTTP_STATUS.OK).send(order);
  }

  async cancelOrder(
    request: FastifyRequest<{ Params: IOrderParams }>,
    reply: FastifyReply
  ): Promise<never> {
    const order = await this.orderService.cancelOrder(request.params.id);
    return reply.code(HTTP_STATUS.OK).send(order);
  }
}
