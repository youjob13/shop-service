import { FastifyReply, FastifyRequest } from 'fastify';
import { IProductParams, IProductQuery } from '@shop/dto/schemas';
import { HTTP_STATUS } from '@shop/shared/http';

import { ProductsService } from '../services/products/products.service.js';

export class ProductController {
  constructor(private productService: ProductsService) {}

  async getProducts(
    request: FastifyRequest<{ Querystring: IProductQuery }>,
    reply: FastifyReply
  ): Promise<never> {
    const products = await this.productService.getProducts(request.query);
    return reply.code(HTTP_STATUS.OK).send(products);
  }

  async getProductById(
    request: FastifyRequest<{ Params: IProductParams }>,
    reply: FastifyReply
  ): Promise<never> {
    const product = await this.productService.getProductById(request.params.id);
    return reply.code(HTTP_STATUS.OK).send(product);
  }
}
