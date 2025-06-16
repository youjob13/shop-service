import { z } from 'zod';
import { FastifyInstance } from 'fastify';
import { HTTP_STATUS } from '@shop/shared/http';
import { OrderSchema, OrderParamsSchema, OrderQuerySchema } from '@shop/dto/schemas';

import { OrderController } from '../controllers/order.controller.js';
import { OrderService } from '../services/orders/order.service.js';

export async function orderRoutes(fastify: FastifyInstance): Promise<void> {
  const orderController = new OrderController(OrderService.getInstance());

  fastify.get('/', {
    schema: {
      querystring: OrderQuerySchema,
      response: {
        [HTTP_STATUS.OK]: z.array(OrderSchema),
      },
    },
    handler: orderController.getOrders.bind(orderController),
  });

  fastify.get('/:id', {
    schema: {
      params: OrderParamsSchema,
      response: {
        [HTTP_STATUS.OK]: OrderSchema,
      },
    },
    handler: orderController.getOrderById.bind(orderController),
  });
}
