import { z } from 'zod';
import { FastifyInstance } from 'fastify';

import {
  ProductSchema,
  CreateProductSchema,
  UpdateProductSchema,
  ProductParamsSchema,
  ProductQuerySchema,
} from '@shop/dto/schemas';
import { HTTP_STATUS } from '@shop/shared/http';
import { initKafkaProducer } from '@shop/kafka-client/kafka-producer';

import { config as Config } from '../config.js';
import { ProductController } from '../controllers/product.controller.js';
import { ProductsService } from '../services/products/products.service.js';

export async function productRoutes(fastify: FastifyInstance): Promise<void> {
  const kafkaProducer = initKafkaProducer(Config.KAFKA);
  const productService = new ProductsService(kafkaProducer);
  const productController = new ProductController(productService);

  fastify.post('/', {
    schema: {
      body: CreateProductSchema,
      response: {
        [HTTP_STATUS.CREATED]: ProductSchema,
      },
    },
    handler: productController.createProduct.bind(productController),
  });

  fastify.get('/', {
    schema: {
      querystring: ProductQuerySchema,
      response: {
        [HTTP_STATUS.OK]: z.array(ProductSchema),
      },
    },
    handler: productController.getProducts.bind(productController),
  });

  fastify.get('/:id', {
    schema: {
      params: ProductParamsSchema,
      response: {
        [HTTP_STATUS.OK]: ProductSchema,
      },
    },
    handler: productController.getProductById.bind(productController),
  });

  fastify.put('/:id', {
    schema: {
      params: ProductParamsSchema,
      body: UpdateProductSchema,
      response: {
        [HTTP_STATUS.OK]: ProductSchema,
      },
    },
    handler: productController.updateProduct.bind(productController),
  });

  fastify.delete('/:id', {
    schema: {
      params: ProductParamsSchema,
      response: {
        [HTTP_STATUS.NO_CONTENT]: z.null(),
      },
    },
    handler: productController.deleteProduct.bind(productController),
  });
}
