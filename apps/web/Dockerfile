FROM node:20.3.1-alpine AS base
WORKDIR /app
ENV PNPM_HOME=/app/.pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN set -e; \
  npm install --global pnpm; \
  mkdir -p $PNPM_HOME ; \
  pnpm install --global turbo;

FROM base as pruner
COPY . .
RUN turbo prune --scope=web --docker --out-dir /exports

# /exports/json - the pruned workspace's package.jsons
#
# /exports/full - the pruned workspace's full source code, but only including
#                 the internal packages that are needed to build the target.
#
# /exports/pnpm-lock.yaml - a new pruned lockfile that only contains the pruned
#                           subset of the original root lockfile with the
#                           dependencies that are actually used by the packages
#                           in the pruned workspace.

FROM base AS installer
COPY --from=pruner /exports/json/ .
COPY --from=pruner /exports/pnpm-lock.yaml .
RUN pnpm install

FROM base AS builder
COPY --from=pruner /app/.turbo/ .turbo/
COPY --from=pruner /exports/full/ .
COPY --from=installer /app/ .
RUN turbo run build --scope=web
 
FROM builder as runner
WORKDIR /app/apps/web/build
EXPOSE 3000
CMD node index.js
