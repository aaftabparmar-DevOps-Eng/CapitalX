#!/bin/bash
echo "📝 Setting up environment..."

MY_IP=$(curl -s ifconfig.me)
echo "🌐 Server IP: ${MY_IP}"

echo "NEXT_PUBLIC_API_URL=http://${MY_IP}:3001/api/v1" > frontend/.env.local

cat > backend/.env << BACKENDENV
NODE_ENV=production
PORT=3001
APP_URL=http://${MY_IP}:3001
FRONTEND_URL=http://${MY_IP}:3000
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/capitalx_db?schema=public"
JWT_ACCESS_SECRET=capitalx_access_jwt_secret_change_in_production
JWT_REFRESH_SECRET=capitalx_refresh_jwt_secret_change_in_production
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
REDIS_URL=redis://redis:6379
ENCRYPTION_KEY=change_this_to_random_32_bytes
ESCROW_PLATFORM_FEE_PERCENT=3
BACKENDENV

echo "✅ Env files created!"
