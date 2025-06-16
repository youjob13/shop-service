import { ICreateProduct, IProduct, IProductQuery, IUpdateProduct } from '@shop/dto/schemas';

export interface IProductService {
  createProduct(product: ICreateProduct): Promise<IProduct>;
  getProducts(queryParams: IProductQuery): Promise<IProduct[]>;
  getProductById(id: number): Promise<IProduct | null>;
  updateProduct(id: number, product: IUpdateProduct): Promise<IProduct>;
  deleteProduct(id: number): Promise<void>;
}
