# Shop Service Architecture

## Overview

This project implements a microservices-based e-commerce system using a monorepo approach. The system is built with Node.js, TypeScript, and follows a message-driven architecture using Kafka for inter-service communication, with additional direct HTTP communication capabilities.

## System Components

### Microservices

1. **Shop Service** (`packages/shop-service`)

   - Frontend-facing API service
   - Handles incoming HTTP requests
   - Produces events to Kafka for data operations
   - Communicates with Data Service via Kafka and direct HTTP calls

2. **Data Service** (`packages/data-service`)
   - Backend data persistence service
   - Consumes events from Kafka
   - Exposes HTTP endpoints for direct communication
   - Manages database operations
   - Implements CRUD operations for domain entities

### Shared Libraries

1. **Kafka Client** (`packages/kafka-client`)

   - Provides Kafka producer and consumer abstractions
   - Manages Kafka connections and message handling

2. **Core** (`packages/core`)

   - Contains core functionality shared across services
   - Includes Fastify app creation utilities
   - Defines Kafka topics and common configurations

3. **DTO** (`packages/dto`)

   - Defines data transfer objects and schemas
   - Includes validation schemas using Zod

4. **Shared** (`packages/shared`)
   - Contains shared utilities
   - Error handling mechanisms
   - HTTP status codes and responses

## Communication Pattern

The system follows a hybrid communication architecture:

1. **Event-Driven Flow**:

   ```
   Client Request → Shop Service → Kafka → Data Service → Database
   ```

2. **Direct API Flow**:

   ```
   Client Request → Shop Service → HTTP Request → Data Service → Database
   ```

3. **Data Query Flow**:
   ```
   Client Request → Shop Service → Data Service (HTTP) → Response
   ```

## Domain Entities

The system manages the following domain entities:

1. **Categories** - Product classifications
2. **Products** - Items available for purchase
3. **Orders** - Customer purchase records

## Event Flow Diagram

```
┌─────────────┐                  ┌───────────┐                  ┌─────────────┐
│             │  HTTP Request    │           │  Kafka Events    │             │
│    Client   │ ───────────────> │   Shop    │ ───────────────> │    Data     │
│             │                  │  Service  │                  │   Service   │
└─────────────┘                  └───────────┘                  └─────────────┘
                                      │                               │
                                      │                               │
                                      │     Direct HTTP Request       │
                                      ├──────────────────────────────>│
                                      │                               │
                                      ▼                               ▼
                                 ┌──────────┐                  ┌─────────────┐
                                 │  Kafka   │                  │             │
                                 │  Broker  │                  │  Database   │
                                 └──────────┘                  │             │
                                                               └─────────────┘
```

## Event Types

1. **Category Events**

   - `CATEGORIES.CREATE` - Create a new category
   - `CATEGORIES.UPDATE` - Update an existing category
   - `CATEGORIES.DELETE` - Delete a category

2. **Product Events**

   - `PRODUCTS.CREATE` - Create a new product
   - `PRODUCTS.UPDATE` - Update an existing product
   - `PRODUCTS.DELETE` - Delete a product

3. **Order Events**
   - `ORDERS.CREATE` - Create a new order
   - `ORDERS.UPDATE` - Update an existing order
   - `ORDERS.DELETE` - Delete an order

## Deployment

The services are containerized using Docker and orchestrated with Docker Compose:

- Shop Service runs as a Node.js application
- Data Service connects to a PostgreSQL database
- Kafka broker handles messaging between services

## Technology Stack

- **Language**: TypeScript
- **Runtime**: Node.js
- **API Framework**: Fastify
- **Messaging**: Kafka
- **Database**: PostgreSQL with Prisma ORM
- **Containerization**: Docker
- **Package Management**: npm workspaces (monorepo)
- **Schema Validation**: Zod

## Development Workflow

The project uses TypeScript project references to manage dependencies between packages. The build order is:

1. Shared packages (shared, dto, core)
2. Infrastructure packages (kafka-client)
3. Service packages (data-service, shop-service)

## Communication Strategies

The system uses both synchronous and asynchronous communication patterns:

1. **Asynchronous (Kafka Events)**

   - Used for operations that can be processed asynchronously
   - Better for scalability and reliability in distributed systems
   - Examples: updating product information, processing orders

2. **Synchronous (Direct HTTP)**
   - Used when immediate responses are needed
   - Better for queries and operations requiring real-time responses
   - Examples: retrieving product details, checking inventory
