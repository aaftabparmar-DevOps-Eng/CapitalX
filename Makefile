.PHONY: dev db-up db-migrate db-seed backend frontend docker clean

dev: db-up db-migrate db-seed
	@echo "Starting CapitalX development servers..."
	@bash scripts/dev.sh

db-up:
	docker compose up -d postgres redis
	@sleep 3

db-migrate:
	cd backend && npx prisma migrate dev --name init

db-generate:
	cd backend && npx prisma generate

db-seed:
	cd backend && npx ts-node prisma/seed.ts

db-studio:
	cd backend && npx prisma studio

backend:
	cd backend && npm run start:dev

frontend:
	cd frontend && npm run dev

docker:
	docker compose up --build

docker-down:
	docker compose down -v

clean:
	rm -rf backend/node_modules frontend/node_modules backend/dist frontend/.next
