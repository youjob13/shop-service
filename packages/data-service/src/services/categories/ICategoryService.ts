import { ICreateCategory, ICategory, IUpdateCategory } from '@shop/dto/schemas';

export interface ICategoryService {
  createCategory(category: ICreateCategory): Promise<ICategory>;
  getCategories(): Promise<ICategory[]>;
  getCategoryById(id: number): Promise<ICategory | null>;
  updateCategory(id: number, category: IUpdateCategory): Promise<ICategory>;
  deleteCategory(id: number): Promise<void>;
}
