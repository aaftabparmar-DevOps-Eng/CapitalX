#!/bin/bash
echo "Creating demo users..."

# Admin
curl -s -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@capitalx.io","password":"Admin@123","firstName":"Admin","lastName":"User","role":"ADMIN"}' | grep -q "success" && echo "Created: admin@capitalx.io / Admin@123" || echo "Skipped: admin@capitalx.io"

# Investor
curl -s -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"investor@capitalx.io","password":"Investor@123","firstName":"Demo","lastName":"Investor","role":"INVESTOR"}' | grep -q "success" && echo "Created: investor@capitalx.io / Investor@123" || echo "Skipped: investor@capitalx.io"

# Business
curl -s -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"business@capitalx.io","password":"Business@123","firstName":"Demo","lastName":"Business","role":"BUSINESS_OWNER"}' | grep -q "success" && echo "Created: business@capitalx.io / Business@123" || echo "Skipped: business@capitalx.io"

echo "Done!"
