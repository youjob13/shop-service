import { ICreateProduct, IUpdateProduct, IProduct, IProductQuery } from '@shop/dto/schemas';

export interface IProductsService {
  getProducts(query: IProductQuery): Promise<IProduct[]>;
  getProductById(id: number): Promise<IProduct | null>;
  createProduct(product: ICreateProduct): Promise<void>;
  updateProduct(id: number, product: IUpdateProduct): Promise<void>;
  deleteProduct(id: number): Promise<void>;
}
