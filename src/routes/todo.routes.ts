import { z } from 'zod';
import { FastifyInstance } from 'fastify';

import { TodoController } from '../controllers/todo.controller.js';
import { TodoSchema, CreateTodoSchema, UpdateTodoSchema, TodoParamsSchema } from '../schemas.js';
import { TodoService } from '../services/todo.service.js';
import { HTTP_STATUS } from '../constants/http.js';

export async function todoRoutes(fastify: FastifyInstance): Promise<void> {
  const todoController = new TodoController(new TodoService());

  fastify.post('/', {
    schema: {
      body: CreateTodoSchema,
      response: {
        [HTTP_STATUS.CREATED]: TodoSchema,
      },
    },
    handler: todoController.createTodo.bind(todoController),
  });

  fastify.get('/', {
    schema: {
      response: {
        [HTTP_STATUS.OK]: z.array(TodoSchema),
      },
    },
    handler: todoController.getTodos.bind(todoController),
  });

  fastify.get('/:id', {
    schema: {
      params: TodoParamsSchema,
      response: {
        [HTTP_STATUS.OK]: z.union([TodoSchema, z.null()]),
      },
    },
    handler: todoController.getTodoById.bind(todoController),
  });

  fastify.put('/:id', {
    schema: {
      params: TodoParamsSchema,
      body: UpdateTodoSchema,
      response: {
        [HTTP_STATUS.OK]: TodoSchema,
      },
    },
    handler: todoController.updateTodo.bind(todoController),
  });

  fastify.delete('/:id', {
    schema: {
      params: TodoParamsSchema,
      response: {
        [HTTP_STATUS.NO_CONTENT]: z.null(),
      },
    },
    handler: todoController.deleteTodo.bind(todoController),
  });
}
