import { z } from 'zod';
import { FastifyInstance } from 'fastify';

import { ProductController } from '../controllers/product.controller.js';
import {
  ProductSchema,
  CreateProductSchema,
  UpdateProductSchema,
  ProductParamsSchema,
  ProductQuerySchema,
} from '../schemas.js';
import { ProductsService } from '../services/products.service.js';
import { HTTP_STATUS } from '../constants/http.js';

export async function productRoutes(fastify: FastifyInstance): Promise<void> {
  const productController = new ProductController(new ProductsService());

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
