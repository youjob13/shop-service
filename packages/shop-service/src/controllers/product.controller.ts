import { FastifyReply, FastifyRequest } from 'fastify';
import { ProductsService } from '../services/products.service.js';
import { ICreateProduct, IProductParams, IUpdateProduct, IProductQuery } from '../schemas.js';
import { HTTP_STATUS } from '../constants/http.js';

export class ProductController {
  constructor(private productService: ProductsService) {}

  async createProduct(
    request: FastifyRequest<{ Body: ICreateProduct }>,
    reply: FastifyReply
  ): Promise<never> {
    const product = await this.productService.createProduct(request.body);
    return reply.code(HTTP_STATUS.CREATED).send(product);
  }

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

  async updateProduct(
    request: FastifyRequest<{
      Params: IProductParams;
      Body: IUpdateProduct;
    }>,
    reply: FastifyReply
  ): Promise<never> {
    const product = await this.productService.updateProduct(request.params.id, request.body);
    return reply.code(HTTP_STATUS.OK).send(product);
  }

  async deleteProduct(
    request: FastifyRequest<{ Params: IProductParams }>,
    reply: FastifyReply
  ): Promise<never> {
    await this.productService.deleteProduct(request.params.id);
    return reply.code(HTTP_STATUS.NO_CONTENT).send();
  }
}
