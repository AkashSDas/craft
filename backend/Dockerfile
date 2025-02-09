FROM node:20-alpine AS builder
RUN corepack enable && corepack prepare pnpm@9.12.2 --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod
COPY . .
RUN pnpm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

ENV NODE_ENV=production
EXPOSE 8000
CMD ["node", "dist/main"]