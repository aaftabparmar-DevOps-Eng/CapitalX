FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001

COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
COPY prisma ./prisma

RUN npx prisma generate
RUN chown -R nestjs:nodejs /app
USER nestjs

EXPOSE 3001
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main"]
