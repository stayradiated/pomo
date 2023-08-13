FROM node:20.5.1-alpine AS base
WORKDIR /app
RUN npm install --global pnpm

FROM base AS devbase
ENV PNPM_HOME=/app/.pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN set -e; \
  mkdir -p $PNPM_HOME ; \
  pnpm install --global turbo;

FROM devbase as pruner
COPY . .
RUN turbo prune --scope=mobile --docker --out-dir /exports

# /exports/json - the pruned workspace's package.jsons
#
# /exports/full - the pruned workspace's full source code, but only including
#                 the internal packages that are needed to build the target.
#
# /exports/pnpm-lock.yaml - a new pruned lockfile that only contains the pruned
#                           subset of the original root lockfile with the
#                           dependencies that are actually used by the packages
#                           in the pruned workspace.

FROM devbase AS installer
COPY --from=pruner /exports/json/ .
COPY --from=pruner /exports/pnpm-lock.yaml .
RUN pnpm install

FROM devbase AS builder
COPY --from=pruner /exports/full/ .
COPY --from=installer /app/ .
RUN turbo run build --scope=mobile
 
FROM base as runner
COPY --from=pruner /exports/json/ .
COPY --from=pruner /exports/pnpm-lock.yaml .
RUN pnpm install --prod
COPY --from=builder /app/apps/mobile/build /app/apps/mobile/build
WORKDIR /app/apps/mobile/build
EXPOSE 3000
CMD node index.js
