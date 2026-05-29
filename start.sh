#!/bin/bash
cd ~/CapitalX

# Start Docker if not running
docker compose up -d postgres 2>/dev/null
sleep 5

# Ensure DB tables exist
cd backend
npx prisma db push 2>/dev/null

# Seed if no users exist
USER_COUNT=$(npx prisma query "SELECT count(*) FROM users" 2>/dev/null | tail -1)
if [ "$USER_COUNT" = "0" ] || [ -z "$USER_COUNT" ]; then
  echo "Seeding database..."
  npx ts-node prisma/seed.ts
fi

# Start backend
npm run start:dev &
cd ../frontend
npm run dev
