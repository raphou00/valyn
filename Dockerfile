FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat bash curl unzip && \
    curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:${PATH}"
COPY package.json bun.lockb ./
COPY prisma ./prisma
RUN bun install
COPY . .
ARG STACK=dev
COPY .env.${STACK} .env
ENV NODE_ENV=production
RUN bun run build

FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache libc6-compat wget
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
