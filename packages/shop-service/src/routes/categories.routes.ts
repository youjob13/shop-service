import { FastifyInstance } from 'fastify';
import { CategoryController } from '../controllers/category.controller.js';
import { CategoryService } from '../services/category.service.js';
import { CategorySchema, CreateCategorySchema, UpdateCategorySchema } from '../schemas.js';
import { HTTP_STATUS } from '../constants/http.js';
import { z } from 'zod';

export async function categoryRoutes(fastify: FastifyInstance): Promise<void> {
  const categoryController = new CategoryController(new CategoryService());

  fastify.post('/', {
    schema: {
      body: CreateCategorySchema,
      response: {
        [HTTP_STATUS.CREATED]: CategorySchema,
      },
    },
    handler: categoryController.createCategory.bind(categoryController),
  });

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

  fastify.put('/:id', {
    schema: {
      params: z.object({ id: z.string() }),
      body: UpdateCategorySchema,
      response: {
        [HTTP_STATUS.OK]: CategorySchema,
      },
    },
    handler: categoryController.updateCategory.bind(categoryController),
  });

  fastify.delete('/:id', {
    schema: {
      params: z.object({ id: z.string() }),
      response: {
        [HTTP_STATUS.NO_CONTENT]: {
          type: 'null',
        },
      },
    },
    handler: categoryController.deleteCategory.bind(categoryController),
  });
}
