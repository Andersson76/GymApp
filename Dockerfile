# 1. Bygg-steg (installera dependencies, bygg appen)

FROM node:20-alpine AS builder

WORKDIR /app

# Installera moduler (använd separat copy för cache-effektivitet)
COPY package.json package-lock.json ./
RUN npm install

# Kopiera resten av appen och bygg den
COPY . .
RUN npm run build

# 2. Runtime-steg (smalare, bara kör den byggda appen)
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Installera endast produktionsberoenden
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# Kopiera endast det som behövs för att köra
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

# Starta Next.js via sin inbyggda server
CMD ["node", "node_modules/next/dist/bin/next", "start"]
