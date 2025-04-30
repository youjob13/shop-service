import { z } from 'zod';
import { FastifyInstance } from 'fastify';

import { initKafkaProducer } from '@shop/kafka-client/kafka-producer';
import { HTTP_STATUS } from '@shop/shared/http';
import {
  OrderSchema,
  CreateOrderSchema,
  UpdateOrderSchema,
  OrderParamsSchema,
  OrderQuerySchema,
} from '@shop/dto/schemas';

import { config as Config } from '../config.js';
import { OrderController } from '../controllers/order.controller.js';
import { OrderService } from '../services/order/order.service.js';

export async function orderRoutes(fastify: FastifyInstance): Promise<void> {
  const kafkaProducer = initKafkaProducer(Config.KAFKA);
  const orderService = new OrderService(kafkaProducer);
  const orderController = new OrderController(orderService);

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
