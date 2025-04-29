import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().min(10),
  price: z.number().min(0),
  stock: z.number().min(0),
  categoryId: z.number(),
  imageUrl: z.string().url().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type IProduct = z.infer<typeof ProductSchema>;

export const CreateProductSchema = z.object({
  name: z.string(),
  description: z.string().min(10),
  price: z.number().min(1),
  stock: z.number().min(0),
  categoryId: z.number(),
  imageUrl: z.string().url().nullish(),
});
export type ICreateProduct = z.infer<typeof CreateProductSchema>;

export const UpdateProductSchema = z.object({
  name: z.string().optional(),
  description: z.string().min(10).optional(),
  price: z.number().min(1).optional(),
  stock: z.number().min(0).optional(),
  categoryId: z.number().optional(),
  imageUrl: z.string().url().nullish(),
});
export type IUpdateProduct = z.infer<typeof UpdateProductSchema>;

export const ProductParamsSchema = z.object({
  id: z.string().transform((val) => parseInt(val, 10)),
});
export type IProductParams = z.infer<typeof ProductParamsSchema>;

export const ProductQuerySchema = z.object({
  categoryId: z.number().optional(),
  minPrice: z.number().min(1).optional(),
  maxPrice: z.number().min(Number.MAX_SAFE_INTEGER).optional(),
  inStock: z.boolean().optional(),
});
export type IProductQuery = z.infer<typeof ProductQuerySchema>;

export enum OrderStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
}
export const OrderStatusSchema = z.enum(['Pending', 'Processing', 'Completed', 'Cancelled']);
export type IOrderStatus = z.infer<typeof OrderStatusSchema>;

export const OrderItemSchema = z.object({
  id: z.number(),
  quantity: z.number().min(1),
  price: z.number().min(0),
  productId: z.number(),
  orderId: z.number(),
});
export type IOrderItem = z.infer<typeof OrderItemSchema>;

export const OrderSchema = z.object({
  id: z.number(),
  status: OrderStatusSchema,
  total: z.number().min(0),
  items: z.array(OrderItemSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type IOrder = z.infer<typeof OrderSchema>;

export const CreateOrderItemSchema = z.object({
  productId: z.number(),
  quantity: z.number().min(1),
});
export type ICreateOrderItem = z.infer<typeof CreateOrderItemSchema>;

export const CreateOrderSchema = z.object({
  items: z.array(CreateOrderItemSchema).min(1),
});
export type ICreateOrder = z.infer<typeof CreateOrderSchema>;

export const UpdateOrderSchema = z.object({
  status: OrderStatusSchema,
});
export type IUpdateOrder = z.infer<typeof UpdateOrderSchema>;

export const OrderParamsSchema = z.object({
  id: z.string().transform((val) => parseInt(val, 10)),
});
export type IOrderParams = z.infer<typeof OrderParamsSchema>;

export const OrderQuerySchema = z.object({
  status: OrderStatusSchema.optional(),
});
export type IOrderQuery = z.infer<typeof OrderQuerySchema>;

export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ICategory = z.infer<typeof CategorySchema>;

export const CreateCategorySchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
});

export type ICreateCategory = z.infer<typeof CreateCategorySchema>;

export const UpdateCategorySchema = z.object({
  name: z.string().optional(),
  description: z.string().nullable().optional(),
});

export type IUpdateCategory = z.infer<typeof UpdateCategorySchema>;
