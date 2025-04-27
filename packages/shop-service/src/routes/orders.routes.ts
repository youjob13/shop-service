import { z } from 'zod';
import { FastifyInstance } from 'fastify';

import { OrderController } from '../controllers/order.controller.js';
import {
  OrderSchema,
  CreateOrderSchema,
  UpdateOrderSchema,
  OrderParamsSchema,
  OrderQuerySchema,
} from '../schemas.js';
import { OrderService } from '../services/order.service.js';
import { HTTP_STATUS } from '../constants/http.js';

export async function orderRoutes(fastify: FastifyInstance): Promise<void> {
  const orderController = new OrderController(new OrderService());

  fastify.post('/', {
    schema: {
      body: CreateOrderSchema,
      response: {
        [HTTP_STATUS.CREATED]: OrderSchema,
      },
    },
    handler: orderController.createOrder.bind(orderController),
  });

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

  fastify.put('/:id/status', {
    schema: {
      params: OrderParamsSchema,
      body: UpdateOrderSchema,
      response: {
        [HTTP_STATUS.OK]: OrderSchema,
      },
    },
    handler: orderController.updateOrderStatus.bind(orderController),
  });

  fastify.post('/:id/cancel', {
    schema: {
      params: OrderParamsSchema,
      response: {
        [HTTP_STATUS.OK]: OrderSchema,
      },
    },
    handler: orderController.cancelOrder.bind(orderController),
  });
}
