import { FastifyInstance } from 'fastify';
import { HTTP_STATUS } from '@shop/shared/http';
import { z } from 'zod';

import { CategorySchema, CreateCategorySchema, UpdateCategorySchema } from '@shop/dto/schemas';
import { initKafkaProducer } from '@shop/kafka-client/kafka-producer';

import { CategoryController } from '../controllers/category.controller.js';
import { CategoriesService } from '../services/categories/categories.service.js';
import { config as Config } from '../config.js';

export async function categoryRoutes(fastify: FastifyInstance): Promise<void> {
  const kafkaProducer = initKafkaProducer(Config.KAFKA);
  const categoryService = new CategoriesService(kafkaProducer);
  const categoryController = new CategoryController(categoryService);

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
