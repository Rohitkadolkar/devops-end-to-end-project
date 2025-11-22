#   BUILD STAGE
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci --production || npm install --production

COPY . .

#   RUNTIME STAGE
FROM node:20-alpine

WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app /app

USER appuser

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "server.js"]
