#!/bin/sh

echo "Waiting for PostgreSQL to be ready..."
while ! pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER; do
  sleep 1
done

echo "Running database migrations..."
npm run db:migrate

echo "Starting the application..."
node dist/index.js 