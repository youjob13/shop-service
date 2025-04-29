import { z } from 'zod';
import { FastifyInstance } from 'fastify';
import { HTTP_STATUS } from '@shop/shared/http';
import { CategorySchema } from '@shop/dto/schemas';

import { CategoryController } from '../controllers/category.controller.js';
import { CategoryService } from '../services/categories/category.service.js';

export async function categoryRoutes(fastify: FastifyInstance): Promise<void> {
  const categoryController = new CategoryController(new CategoryService());

  fastify.get('/', {
    schema: {
      response: {
        [HTTP_STATUS.OK]: {
          type: 'array',
          items: CategorySchema,
        },
      },
    },
    handler: categoryController.getCategories.bind(categoryController),
  });

  fastify.get('/:id', {
    schema: {
      params: z.object({ id: z.string() }),
      response: {
        [HTTP_STATUS.OK]: CategorySchema,
      },
    },
    handler: categoryController.getCategoryById.bind(categoryController),
  });
}
