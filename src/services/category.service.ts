import { ICategory, ICreateCategory, IUpdateCategory } from '../schemas.js';
import { AppError } from '../errors.js';
import { HTTP_STATUS } from '../constants/http.js';
import prisma from '../db.js';

export class CategoryService {
  async createCategory(data: ICreateCategory): Promise<ICategory> {
    try {
      return await prisma.category.create({
        data: {
          name: data.name,
          description: data.description,
        },
      });
    } catch (error) {
      throw new AppError('Failed to create category', HTTP_STATUS.INTERNAL_SERVER_ERROR, { error });
    }
  }

  async getCategories(): Promise<ICategory[]> {
    try {
      return await prisma.category.findMany();
    } catch (error) {
      throw new AppError('Failed to fetch categories', HTTP_STATUS.INTERNAL_SERVER_ERROR, {
        error,
      });
    }
  }

  async getCategoryById(id: number): Promise<ICategory | null> {
    try {
      return await prisma.category.findUnique({
        where: { id },
      });
    } catch (error) {
      throw new AppError('Failed to fetch category', HTTP_STATUS.INTERNAL_SERVER_ERROR, { error });
    }
  }

  async updateCategory(id: number, data: IUpdateCategory): Promise<ICategory> {
    try {
      return await prisma.category.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
        },
      });
    } catch (error) {
      throw new AppError('Failed to update category', HTTP_STATUS.INTERNAL_SERVER_ERROR, { error });
    }
  }

  async deleteCategory(id: number): Promise<void> {
    try {
      await prisma.category.delete({
        where: { id },
      });
    } catch (error) {
      throw new AppError('Failed to delete category', HTTP_STATUS.INTERNAL_SERVER_ERROR, { error });
    }
  }
}
