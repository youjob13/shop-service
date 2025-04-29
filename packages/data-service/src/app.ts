import { createApp } from '@shop/core/fastify';
import { initKafkaConsumer } from '@shop/kafka-client/kafka-consumer';

import { productRoutes } from './routes/products.routes.js';
import { orderRoutes } from './routes/orders.routes.js';
import { categoryRoutes } from './routes/categories.routes.js';
import { Routes } from './routes/models.js';
import { OrdersHandler } from './kafka-handlers/OrdersHandler.js';
import { OrderService } from './services/orders/order.service.js';
import { ProductsHandler } from './kafka-handlers/ProductsHandler.js';
import { ProductsService } from './services/products/products.service.js';
import { CategoriesHandler } from './kafka-handlers/CategoriesHandler.js';
import { CategoryService } from './services/categories/category.service.js';

const app = createApp({
  swaggerOptions: {
    openapi: {
      info: {
        title: 'Shop Service API',
        description: 'A simple Shop Service API built with Fastify',
        version: '1.0.0',
      },
    },
  },
});

app.register(orderRoutes, { prefix: Routes.Orders });
app.register(productRoutes, { prefix: Routes.Products });
app.register(categoryRoutes, { prefix: Routes.Categories });

const kafkaConsumerPromise: ReturnType<typeof initKafkaConsumer> = initKafkaConsumer(
  { clientId: 'shop-service', brokers: ['localhost:9092'] },
  { groupId: 'shop-service', retry: { retries: 3 }, logger: app.log }
);

new OrdersHandler(kafkaConsumerPromise, new OrderService());
new ProductsHandler(kafkaConsumerPromise, new ProductsService());
new CategoriesHandler(kafkaConsumerPromise, new CategoryService());

export { app, kafkaConsumerPromise };
