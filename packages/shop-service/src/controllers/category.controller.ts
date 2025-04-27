import { FastifyReply, FastifyRequest } from 'fastify';
import { CategoryService } from '../services/category.service.js';
import { ICreateCategory, IUpdateCategory } from '../schemas.js';
import { HTTP_STATUS } from '../constants/http.js';

export class CategoryController {
  constructor(private categoryService: CategoryService) {}

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
    const id = parseInt(request.params.id, 10);
    const category = await this.categoryService.getCategoryById(id);
    return reply.code(HTTP_STATUS.OK).send(category);
  }

  async updateCategory(
    request: FastifyRequest<{
      Params: { id: string };
      Body: IUpdateCategory;
    }>,
    reply: FastifyReply
  ): Promise<never> {
    const id = parseInt(request.params.id, 10);
    const category = await this.categoryService.updateCategory(id, request.body);
    return reply.code(HTTP_STATUS.OK).send(category);
  }

  async deleteCategory(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<never> {
    const id = parseInt(request.params.id, 10);
    await this.categoryService.deleteCategory(id);
    return reply.code(HTTP_STATUS.NO_CONTENT).send();
  }
}
