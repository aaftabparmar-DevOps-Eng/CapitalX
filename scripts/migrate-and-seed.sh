#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/../backend"
echo "Running Prisma migrations..."
npx prisma migrate dev --name init
echo "Generating Prisma client..."
npx prisma generate
echo "Seeding database..."
npx ts-node prisma/seed.ts
echo "Done!"
