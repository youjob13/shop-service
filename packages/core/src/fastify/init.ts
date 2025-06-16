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
import { z } from 'zod';

import { HTTP_STATUS, HTTP_MESSAGES } from '@shop/shared/http';

const defaultOptions = {
  cors: {
    origin: true,
    credentials: true,
  },
  logger: true,
  rateLimit: {
    max: 100,
    timeWindow: '1 minute',
  },
  swaggerOptions: {
    openapi: undefined,
  },
};

const InitAppOptions = z
  .object({
    cors: z
      .object({
        origin: z.union([z.string(), z.boolean(), z.array(z.string())]),
        credentials: z.boolean(),
      })
      .optional(),
    logger: z.boolean().optional(),
    rateLimit: z
      .object({
        max: z.number(),
        timeWindow: z.union([z.string(), z.number()]),
      })
      .optional(),
    swaggerOptions: z.object({
      openapi: z
        .object({
          info: z.object({
            title: z.string(),
            description: z.string(),
            version: z.string(),
          }),
        })
        .optional(),
    }),
  })
  .default(defaultOptions);

export type IInitAppOptions = z.infer<typeof InitAppOptions>;

export function createApp(options: IInitAppOptions): FastifyInstance {
  const app: FastifyInstance = fastify({
    logger: options.logger,
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.withTypeProvider<ZodTypeProvider>();

  if (options.cors) {
    app.register(cors, options.cors);
  }

  if (options.rateLimit) {
    app.register(rateLimit, options.rateLimit);
  }

  if (options.swaggerOptions.openapi) {
    app.register(swagger, {
      openapi: options.swaggerOptions.openapi,
      transform: jsonSchemaTransform,
    });

    app.register(swaggerUi, {
      routePrefix: '/documentation',
    });
  }

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

  return app;
}
