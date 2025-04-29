import { FastifyReply, FastifyRequest } from 'fastify';
import { HTTP_STATUS } from '@shop/shared/http';

import { CategoryService } from '../services/categories/category.service.js';

export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  async getCategories(request: FastifyRequest, reply: FastifyReply): Promise<never> {
    const categories = await this.categoryService.getCategories();
    return reply.code(HTTP_STATUS.OK).send(categories);
  }

  async getCategoryById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<never> {
    const id = parseInt(request.params.id, 10);
    const category = await this.categoryService.getCategoryById(id);
    return reply.code(HTTP_STATUS.OK).send(category);
  }
}
