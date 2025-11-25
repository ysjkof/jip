FROM oven/bun:1

WORKDIR /app

COPY package.json ./
COPY prisma ./prisma/

RUN apt-get update -y && apt-get install -y openssl

RUN bun install

COPY . .

# Prisma requires DATABASE_URL to be set even for generation
ENV DATABASE_URL="file:./dev.db"

RUN bunx prisma generate

EXPOSE 3000

CMD ["sh", "-c", "bunx prisma migrate deploy && bun run src/index.ts"]
