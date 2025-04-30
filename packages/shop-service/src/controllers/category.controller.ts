import { FastifyReply, FastifyRequest } from 'fastify';

import { ICreateCategory, IUpdateCategory } from '@shop/dto/schemas';
import { HTTP_STATUS } from '@shop/shared/http';

import { CategoriesService } from '../services/categories/categories.service.js';

export class CategoryController {
  constructor(private categoryService: CategoriesService) {}

  async createCategory(
    request: FastifyRequest<{ Body: ICreateCategory }>,
    reply: FastifyReply
  ): Promise<never> {
    const category = await this.categoryService.createCategory(request.body);
    return reply.code(HTTP_STATUS.CREATED).send(category);
  }

  async getCategories(request: FastifyRequest, reply: FastifyReply): Promise<never> {
    const categories = await this.categoryService.getCategories();
    return reply.code(HTTP_STATUS.OK).send(categories);
  }

  async getCategoryById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<never> {
    const category = await this.categoryService.getCategoryById(Number(request.params.id));
    return reply.code(HTTP_STATUS.OK).send(category);
  }

  async updateCategory(
    request: FastifyRequest<{
      Params: { id: string };
      Body: IUpdateCategory;
    }>,
    reply: FastifyReply
  ): Promise<never> {
    const category = await this.categoryService.updateCategory(
      Number(request.params.id),
      request.body
    );
    return reply.code(HTTP_STATUS.OK).send(category);
  }

  async deleteCategory(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<never> {
    await this.categoryService.deleteCategory(Number(request.params.id));
    return reply.code(HTTP_STATUS.NO_CONTENT).send();
  }
}
