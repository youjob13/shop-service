# Todo API

A RESTful API for managing todos built with Fastify and PostgreSQL.

## Setup

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```
   # Application
   NODE_ENV=development
   PORT=3000

   # Database
   DATABASE_URL=postgres://username:password@localhost:5432/todo_db
   ```

4. Start the app in docker:
   ```bash
   npm run start:docker
   ```
