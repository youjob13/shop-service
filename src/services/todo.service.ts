import { AppError } from '../errors.js';
import prisma from '../db.js';
import { HTTP_STATUS } from '../constants/http.js';
import { ICreateTodo, ITodo, IUpdateTodo } from '../schemas.js';

export class TodoService {
  async createTodo(todo: ICreateTodo): Promise<ITodo> {
    try {
      return await prisma.todo.create({
        data: {
          ...todo,
          completed: false,
        },
      });
    } catch (error) {
      throw new AppError('Failed to create todo', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  async getTodos(): Promise<ITodo[]> {
    try {
      const todos = (await prisma.todo.findMany()) ?? [];

      console.log(todos);

      return todos;
    } catch (error) {
      throw new AppError('Failed to fetch todos', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  async getTodoById(id: number): Promise<ITodo | null> {
    try {
      return await prisma.todo.findUnique({
        where: { id },
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch todo', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  async updateTodo(id: number, todo: IUpdateTodo): Promise<ITodo> {
    try {
      return await prisma.todo.update({
        where: { id },
        data: todo,
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to update todo', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteTodo(id: number): Promise<null> {
    try {
      await prisma.todo.delete({
        where: { id },
      });
      return null;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to delete todo', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }
}
