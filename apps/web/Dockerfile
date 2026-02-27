# ---- Dependencies Stage ----
FROM node:21-alpine AS deps

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

COPY packages/api/package.json ./packages/api/
COPY packages/config/package.json ./packages/config/
COPY packages/features/package.json ./packages/features/
COPY packages/hooks/package.json ./packages/hooks/
COPY packages/types/package.json ./packages/types/
COPY packages/ui/package.json ./packages/ui/
COPY packages/utils/package.json ./packages/utils/

COPY apps/web/package.json ./apps/web/

# ✅ --shamefully-hoist flattens all packages into root node_modules
# This fixes symlink resolution issues with Turbopack in Docker
RUN pnpm install --shamefully-hoist

# ---- Build Stage ----
FROM node:21-alpine AS build

RUN corepack enable && corepack prepare pnpm@latest --activate

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

WORKDIR /app

COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./

# ✅ With shamefully-hoist, everything is in root node_modules
# No need to copy individual package node_modules anymore
COPY --from=deps /app/node_modules ./node_modules

COPY packages/ ./packages/
COPY apps/web/ ./apps/web/

WORKDIR /app/apps/web

RUN pnpm run build

# ---- Runtime Stage ----
FROM node:21-alpine AS final

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY --from=build /app/apps/web/.next ./.next
COPY --from=build /app/apps/web/public ./public
COPY --from=build /app/apps/web/package.json ./
COPY --from=build /app/apps/web/next.config.ts ./
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000

CMD ["pnpm", "run", "start"]