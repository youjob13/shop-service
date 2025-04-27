import { FastifyReply, FastifyRequest } from 'fastify';

import { TodoService } from '../services/todo.service.js';
import { AppError } from '../errors.js';
import { ICreateTodo, ITodoParams, IUpdateTodo } from '../schemas.js';
import { HTTP_STATUS, HTTP_MESSAGES } from '../constants/http.js';

export class TodoController {
  constructor(private todoService: TodoService) {}

  async createTodo(
    request: FastifyRequest<{ Body: ICreateTodo }>,
    reply: FastifyReply
  ): Promise<never> {
    try {
      const todo = await this.todoService.createTodo(request.body);
      return reply.code(HTTP_STATUS.CREATED).send(todo);
    } catch (error) {
      if (error instanceof AppError) {
        return reply.code(error.statusCode).send({ error: error.message });
      }
      return reply
        .code(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send({ error: HTTP_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }

  async getTodos(request: FastifyRequest, reply: FastifyReply): Promise<never> {
    try {
      const todos = await this.todoService.getTodos();
      return reply.code(HTTP_STATUS.OK).send(todos);
    } catch (error) {
      if (error instanceof AppError) {
        return reply.code(error.statusCode).send({ error: error.message });
      }
      return reply
        .code(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send({ error: HTTP_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }

  async getTodoById(
    request: FastifyRequest<{ Params: ITodoParams }>,
    reply: FastifyReply
  ): Promise<never> {
    try {
      const todo = await this.todoService.getTodoById(request.params.id);
      return reply.code(HTTP_STATUS.OK).send(todo);
    } catch (error) {
      if (error instanceof AppError) {
        return reply.code(error.statusCode).send({ error: error.message });
      }
      return reply
        .code(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send({ error: HTTP_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }

  async updateTodo(
    request: FastifyRequest<{ Params: ITodoParams; Body: IUpdateTodo }>,
    reply: FastifyReply
  ): Promise<never> {
    try {
      const todo = await this.todoService.updateTodo(request.params.id, request.body);
      return reply.code(HTTP_STATUS.OK).send(todo);
    } catch (error) {
      if (error instanceof AppError) {
        return reply.code(error.statusCode).send({ error: error.message });
      }
      return reply
        .code(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send({ error: HTTP_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }

  async deleteTodo(
    request: FastifyRequest<{ Params: ITodoParams }>,
    reply: FastifyReply
  ): Promise<never> {
    try {
      await this.todoService.deleteTodo(request.params.id);
      return reply.code(HTTP_STATUS.NO_CONTENT).send();
    } catch (error) {
      if (error instanceof AppError) {
        return reply.code(error.statusCode).send({ error: error.message });
      }
      return reply
        .code(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send({ error: HTTP_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  }
}
