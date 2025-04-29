import { AppError } from '@shop/shared/errors';
import { HTTP_STATUS } from '@shop/shared/http';
import { ICreateOrder, IOrder, OrderStatus, IOrderQuery, IOrderStatus } from '@shop/dto/schemas';

import prisma from '../../db.js';
import { IOrderService } from './IOrderService.js';

export class OrderService implements IOrderService {
  private static instance: OrderService;

  constructor() {
    if (new.target === OrderService && !OrderService.instance) {
      OrderService.instance = new OrderService();
    }

    return OrderService.instance;
  }

  async createOrder(data: ICreateOrder): Promise<IOrder> {
    try {
      const items = await Promise.all(
        data.items.map(async (item) => {
          const product = await prisma.product.findUnique({
            where: { id: item.productId },
          });

          if (!product) {
            throw new AppError(
              `Product with ID ${item.productId} not found`,
              HTTP_STATUS.NOT_FOUND
            );
          }

          if (product.stock < item.quantity) {
            throw new AppError(
              `Insufficient stock for product ${product.name}`,
              HTTP_STATUS.BAD_REQUEST
            );
          }

          return {
            ...item,
            price: product.price,
          };
        })
      );

      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      return await prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
          data: {
            status: OrderStatus.Pending,
            total,
            items: {
              create: items,
            },
          },
          include: {
            items: true,
          },
        });

        await Promise.all(
          items.map((item) =>
            tx.product.update({
              where: { id: item.productId },
              data: {
                stock: {
                  decrement: item.quantity,
                },
              },
            })
          )
        );

        return order;
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to create order', HTTP_STATUS.INTERNAL_SERVER_ERROR, { error });
    }
  }

  async getOrders(query?: IOrderQuery): Promise<IOrder[]> {
    try {
      const orders: IOrder[] = await prisma.order.findMany({
        where: {
          status: query?.status,
        },
        include: {
          items: true,
        },
      });

      return orders;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new AppError(`Failed to fetch orders: ${error.message}`, 500);
      }
      throw new AppError('Failed to fetch orders', 500);
    }
  }

  async getOrderById(id: number): Promise<IOrder | null> {
    try {
      return await prisma.order.findUnique({
        where: { id },
        include: {
          items: true,
        },
      });
    } catch (error) {
      throw new AppError('Failed to fetch order', HTTP_STATUS.INTERNAL_SERVER_ERROR, { error });
    }
  }

  async updateOrderStatus(id: number, status: IOrderStatus): Promise<IOrder> {
    try {
      return await prisma.order.update({
        where: { id },
        data: { status },
        include: {
          items: true,
        },
      });
    } catch (error) {
      throw new AppError('Failed to update order', HTTP_STATUS.INTERNAL_SERVER_ERROR, { error });
    }
  }

  async cancelOrder(id: number): Promise<IOrder> {
    try {
      return await prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
          where: { id },
          include: { items: true },
        });

        if (!order) {
          throw new AppError('Order not found', HTTP_STATUS.NOT_FOUND);
        }

        if (order.status === OrderStatus.Cancelled) {
          throw new AppError('Order is already cancelled', HTTP_STATUS.BAD_REQUEST);
        }

        await Promise.all(
          order.items.map((item) =>
            tx.product.update({
              where: { id: item.productId },
              data: {
                stock: {
                  increment: item.quantity,
                },
              },
            })
          )
        );

        return await tx.order.update({
          where: { id },
          data: { status: OrderStatus.Cancelled },
          include: { items: true },
        });
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to cancel order', HTTP_STATUS.INTERNAL_SERVER_ERROR, { error });
    }
  }
}
