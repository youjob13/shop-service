import { z } from 'zod';
import { FastifyInstance } from 'fastify';

import { ProductSchema, ProductParamsSchema, ProductQuerySchema } from '@shop/dto/schemas';
import { HTTP_STATUS } from '@shop/shared/http';

import { ProductController } from '../controllers/product.controller.js';
import { ProductsService } from '../services/products/products.service.js';

export async function productRoutes(fastify: FastifyInstance): Promise<void> {
  const productController = new ProductController(new ProductsService());

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
}
