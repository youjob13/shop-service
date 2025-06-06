import { AppError } from '@shop/shared/errors';
import { HTTP_STATUS } from '@shop/shared/http';
import { ICreateProduct, IProduct, IProductQuery, IUpdateProduct } from '@shop/dto/schemas';

import prisma from '../../db.js';
import { IProductService } from './IProductService.js';

export class ProductsService implements IProductService {
  private static instance: ProductsService;

  public static getInstance(): ProductsService {
    if (!ProductsService.instance) {
      ProductsService.instance = new ProductsService();
    }

    return ProductsService.instance;
  }

  async createProduct(product: ICreateProduct): Promise<IProduct> {
    try {
      return await prisma.product.create({
        data: product,
      });
    } catch (error) {
      throw new AppError('Failed to create product', HTTP_STATUS.INTERNAL_SERVER_ERROR, { error });
    }
  }

  async getProducts(queryParams: IProductQuery): Promise<IProduct[]> {
    try {
      let query: { price?: object; stock?: object } = {};

      if (queryParams.maxPrice) {
        query = {
          ...query,
          price: { lte: queryParams.maxPrice },
        };
      }

      if (queryParams.minPrice) {
        query = {
          ...query,
          price: { ...query.price, gte: queryParams.minPrice },
        };
      }

      if (queryParams.inStock) {
        query = {
          ...query,
          stock: { gt: 0 },
        };
      }

      const products = await prisma.product.findMany({
        where: query,
      });
      return products;
    } catch (error) {
      throw new AppError('Failed to fetch products', HTTP_STATUS.INTERNAL_SERVER_ERROR, { error });
    }
  }

  async getProductById(id: number): Promise<IProduct | null> {
    try {
      return await prisma.product.findUnique({
        where: { id },
      });
    } catch (error) {
      throw new AppError('Failed to fetch product', HTTP_STATUS.INTERNAL_SERVER_ERROR, { error });
    }
  }

  async updateProduct(id: number, product: IUpdateProduct): Promise<IProduct> {
    try {
      return await prisma.product.update({
        where: { id },
        data: product,
      });
    } catch (error) {
      throw new AppError('Failed to update product', HTTP_STATUS.INTERNAL_SERVER_ERROR, { error });
    }
  }

  async deleteProduct(id: number): Promise<void> {
    try {
      await prisma.product.delete({
        where: { id },
      });
    } catch (error) {
      throw new AppError('Failed to delete product', HTTP_STATUS.INTERNAL_SERVER_ERROR, { error });
    }
  }
}
