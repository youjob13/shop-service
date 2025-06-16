import { createApp } from '@shop/core/fastify';

import { productRoutes } from './routes/products.routes.js';
import { orderRoutes } from './routes/orders.routes.js';
import { categoryRoutes } from './routes/categories.routes.js';
import { Routes } from './routes/models.js';

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

export default app;
