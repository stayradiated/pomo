#syntax=docker/dockerfile:1.4

# --- Base ---
FROM node:25.2.1-alpine@sha256:f4769ca6eeb6ebbd15eb9c8233afed856e437b75f486f7fccaa81d7c8ad56007 AS base
WORKDIR /app
ENV CI=1
RUN set -eux; \
  npm install --global pnpm; \
  pnpm install turbo

# --- Turbo ---
FROM base AS turbo
COPY . .
RUN TURBO_TELEMETRY_DISABLED=1 pnpm exec turbo prune --docker --out-dir=/exports 'web'

# /exports/json - the pruned workspace's package.jsons
#
# /exports/full - the pruned workspace's full source code, but only including
#                 the internal packages that are needed to build the target.
#
# /exports/pnpm-lock.yaml - a new pruned lockfile that only contains the pruned
#                           subset of the original root lockfile with the
#                           dependencies that are actually used by the packages
#                           in the pruned workspace.

# --- Node Modules ---
FROM base AS node_modules
COPY --from=turbo /exports/json/ .
COPY --from=turbo /exports/pnpm-lock.yaml .
RUN pnpm install --frozen-lockfile

# --- Builder ---
FROM base AS builder
COPY --from=turbo /exports/full/ .
COPY --from=node_modules /app/ .
RUN set -eux; \
  cd apps/web; \
  pnpm exec svelte-kit sync; \
  pnpm exec vite build; \
  find build -type f -name '*.map' -delete

# --- Runner ---
FROM base AS runner
COPY --from=turbo /exports/json/ .
COPY --from=turbo /exports/pnpm-lock.yaml .

WORKDIR /app/apps/web
RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/apps/web/build ./build
COPY --from=builder /app/apps/web/migrations ./migrations
COPY --from=builder /app/apps/web/docker-app-start.sh /app/apps/web/gmrc.cjs ./

EXPOSE 3000
CMD ["./docker-app-start.sh"]
