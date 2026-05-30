#!/bin/bash

set -e

REPO="https://github.com/aaftabparmar-DevOps-Eng/CapitalX.git"

read -p "Enter EC2 Public IP: " PUBLIC_IP

rm -rf CapitalX

git clone $REPO

cd CapitalX

cat > frontend/.env.local <<EOF
NEXT_PUBLIC_API_URL=http://${PUBLIC_IP}:3001/api/v1
EOF

cat > backend/.env <<EOF
NODE_ENV=production
PORT=3001

APP_URL=http://${PUBLIC_IP}:3001
FRONTEND_URL=http://${PUBLIC_IP}:3000

DATABASE_URL=postgresql://postgres:postgres@postgres:5432/capitalx_db?schema=public

JWT_ACCESS_SECRET=capitalx_access_secret
JWT_REFRESH_SECRET=capitalx_refresh_secret

REDIS_URL=redis://redis:6379

ENCRYPTION_KEY=capitalx_32byte_encryption_key

ESCROW_PLATFORM_FEE_PERCENT=3

AI_SERVICE_URL=http://ai-service:5000

UPI_ID=capitalx@upi
EOF

docker compose down || true

docker compose up -d --build

sleep 20

docker ps

echo ""
echo "================================="
echo "Frontend:"
echo "http://${PUBLIC_IP}:3000"
echo ""
echo "Backend:"
echo "http://${PUBLIC_IP}:3001"
echo ""
echo "Swagger:"
echo "http://${PUBLIC_IP}:3001/api/docs"
echo "================================="
