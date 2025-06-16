import { ICreateCategory, IUpdateCategory, ICategory } from '@shop/dto/schemas';

export interface ICategoriesService {
  getCategories(): Promise<ICategory[]>;
  getCategoryById(id: number): Promise<ICategory | null>;
  createCategory(category: ICreateCategory): Promise<void>;
  updateCategory(id: number, category: IUpdateCategory): Promise<void>;
  deleteCategory(id: number): Promise<void>;
}
