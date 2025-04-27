import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';

import { productRoutes } from './routes/products.routes.js';
import { orderRoutes } from './routes/orders.routes.js';
import { categoryRoutes } from './routes/categories.routes.js';
import { HTTP_STATUS, HTTP_MESSAGES } from './constants/http.js';
import { config } from './config.js';

const app: FastifyInstance = fastify({
  logger: true,
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.withTypeProvider<ZodTypeProvider>();

app.register(cors, {
  origin: true,
  credentials: true,
});

app.register(rateLimit, config.rateLimit);

app.register(swagger, {
  openapi: {
    info: {
      title: 'Shop Service API',
      description: 'A simple Shop Service API built with Fastify',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
});

app.register(swaggerUi, {
  routePrefix: '/documentation',
});

app.setErrorHandler(
  (
    error: Error & { validation?: unknown; statusCode?: number },
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    app.log.error(error);

    if (error.validation) {
      reply.status(HTTP_STATUS.BAD_REQUEST).send({
        error: HTTP_MESSAGES.VALIDATION_ERROR,
        details: error.validation,
      });
      return;
    }

    reply.status(error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
      error: error.message || HTTP_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
);

app.register(orderRoutes, { prefix: '/api/order' });
app.register(productRoutes, { prefix: '/api/products' });
app.register(categoryRoutes, { prefix: '/api/categories' });

export default app;
